import { initializeApp } from "https://www.gstatic.com/firebasejs/12.15.0/firebase-app.js";
import {
  getFirestore, collection, doc, setDoc, addDoc, deleteDoc, updateDoc,
  onSnapshot, writeBatch
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-firestore.js";
import {
  getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.15.0/firebase-auth.js";

/* =========================================================================
   FIREBASE INIT
========================================================================= */

const fbApp = initializeApp(window.FIREBASE_CONFIG);
const db = getFirestore(fbApp);
const auth = getAuth(fbApp);
const ADMIN_EMAIL = window.ADMIN_EMAIL;

/* =========================================================================
   STATE
========================================================================= */

const state = {
  view: 'dashboard',
  loaded: false,
  isAdmin: false,
  categories: (window.SEED_CATEGORIES || []),
  questions: [],
  templates: [],
  locations: [],
  locationsLoaded: false,
  runs: [],
  runsLoaded: false,
  settingsTab: 'library',
  activeRunId: null,
  draftRun: null,
  editingQuestion: null,   // 'new' | {question, isChild, parentId} | null
  editingTemplate: null,   // 'new' | template | null
  editingLocation: null,   // 'new' | location | null
  selectedLocationId: null,
  selectedLocationName: null,
  takeStage: 'filling',          // 'filling' | 'review'
  takeValidationAttempted: false,
  templateEditorTab: 'select',
  showingLightbox: false
};

/* =========================================================================
   HELPERS
========================================================================= */

function uid(prefix) { return prefix + '_' + Math.random().toString(36).slice(2, 10); }
function todayISO() { return new Date().toISOString().slice(0, 10); }
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[c]));
}
function fmtDate(iso) {
  if (!iso) return '\u2014';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}
function isPassOption(opt) { return /^Yes\b/.test(opt || ''); }
function isFailOption(opt) { return /^No\b/.test(opt || ''); }
function isExcludedOption(opt) { return /^Not\s+(Observable|Applicable)/i.test(opt || ''); }

function flattenAnswerable(question) {
  // returns array of {code, text, guidance, links, photos, options, severity, category, isChild, parentCode, parentText}
  const out = [];
  if (question.children && question.children.length) {
    question.children.forEach(c => {
      out.push({
        code: c.id, text: c.text, guidance: c.guidance, links: c.links || [], photos: c.photos || [],
        options: c.options || [], severity: question.severity, category: question.category,
        isChild: true, parentCode: question.id, parentText: question.text,
        parentGuidance: question.guidance, parentLinks: question.links || [], parentPhotos: question.photos || []
      });
    });
  } else {
    out.push({
      code: question.id, text: question.text, guidance: question.guidance, links: question.links || [], photos: question.photos || [],
      options: question.options || [], severity: question.severity, category: question.category,
      isChild: false, parentCode: null, parentText: null, parentLinks: [], parentPhotos: []
    });
  }
  return out;
}

function computeScore(responses) {
  const scoreable = responses.filter(r => r.options && r.options.length > 0);
  const scored = scoreable.filter(r => r.answer && !isExcludedOption(r.answer));
  const pass = scored.filter(r => isPassOption(r.answer)).length;
  const fail = scored.filter(r => isFailOption(r.answer)).length;
  const excluded = scoreable.length - scored.length;
  const criticalFails = responses.filter(r => r.severity === 'IMMEDIATE' && isFailOption(r.answer)).length;
  const percent = scored.length ? Math.round((pass / scored.length) * 100) : 100;
  let grade;
  if (criticalFails > 0) grade = 'F';
  else if (percent >= 90) grade = 'A';
  else if (percent >= 80) grade = 'B';
  else if (percent >= 70) grade = 'C';
  else grade = 'F';
  return { percent, pass, fail, excluded, criticalFails, grade, totalScoreable: scoreable.length };
}
function gradeColorVar(grade) {
  if (grade === 'A' || grade === 'B') return 'var(--safe)';
  if (grade === 'C') return 'var(--medium)';
  return 'var(--danger)';
}

function sanitizeForFirestore(value) {
  if (Array.isArray(value)) return value.map(sanitizeForFirestore);
  if (value && typeof value === 'object') {
    const out = {};
    Object.keys(value).forEach(k => {
      out[k] = value[k] === undefined ? null : sanitizeForFirestore(value[k]);
    });
    return out;
  }
  return value;
}

function toCSV(rows) {
  const e = v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"';
  return rows.map(r => r.map(e).join(',')).join('\n');
}
function downloadText(filename, text, mime) {
  const blob = new Blob([text], { type: mime || 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click(); document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* =========================================================================
   LOCAL DRAFT STORAGE (in-progress assessments live in this browser only,
   until submitted — at which point they're written to Firestore)
========================================================================= */

const DRAFTS_KEY = 'safe_assessment_drafts_v1';
function loadLocalDrafts() {
  try { return JSON.parse(localStorage.getItem(DRAFTS_KEY) || '[]'); } catch (e) { return []; }
}
function saveLocalDrafts(drafts) {
  try { localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts)); } catch (e) { console.error(e); }
}
function upsertLocalDraft(run) {
  const drafts = loadLocalDrafts();
  const idx = drafts.findIndex(d => d.id === run.id);
  if (idx >= 0) drafts[idx] = run; else drafts.unshift(run);
  saveLocalDrafts(drafts);
}
function removeLocalDraft(id) {
  saveLocalDrafts(loadLocalDrafts().filter(d => d.id !== id));
}

const LOCATION_KEY = 'safe_selected_location_v1';
function loadSelectedLocation() {
  try { return JSON.parse(localStorage.getItem(LOCATION_KEY) || 'null'); } catch (e) { return null; }
}
function saveSelectedLocation(id, name) {
  try { localStorage.setItem(LOCATION_KEY, JSON.stringify({ id, name })); } catch (e) { console.error(e); }
}
function clearSelectedLocation() {
  try { localStorage.removeItem(LOCATION_KEY); } catch (e) { console.error(e); }
}

/* =========================================================================
   FIRESTORE DATA LAYER
========================================================================= */

function subscribeQuestions() {
  onSnapshot(collection(db, 'questions'), snap => {
    const qs = [];
    snap.forEach(d => qs.push(d.data()));
    if (qs.length === 0 && state.questions.length === 0) {
      // nothing seeded yet — leave state.questions empty; Settings will offer a seed button
    }
    state.questions = qs;
    state.loaded = true;
    render();
  }, err => { console.error('questions listener error', err); state.loaded = true; render(); });
}
function subscribeTemplates() {
  onSnapshot(collection(db, 'templates'), snap => {
    const t = [];
    snap.forEach(d => t.push({ id: d.id, ...d.data() }));
    state.templates = t;
    render();
  }, err => console.error('templates listener error', err));
}
function subscribeLocations() {
  onSnapshot(collection(db, 'locations'), snap => {
    const l = [];
    snap.forEach(d => l.push({ id: d.id, ...d.data() }));
    state.locations = l;
    state.locationsLoaded = true;

    if (state.selectedLocationId && !l.some(x => x.id === state.selectedLocationId)) {
      state.selectedLocationId = null;
      state.selectedLocationName = null;
      clearSelectedLocation();
    }
    if (!state.selectedLocationId && l.length === 1) {
      state.selectedLocationId = l[0].id;
      state.selectedLocationName = l[0].name;
      saveSelectedLocation(l[0].id, l[0].name);
    }

    render();
  }, err => {
    console.error('locations listener error', err);
    state.locationsLoaded = true;
    render();
  });
}
let runsUnsub = null;
function subscribeRunsIfAdmin() {
  if (runsUnsub) { runsUnsub(); runsUnsub = null; }
  if (!state.isAdmin) { state.runs = []; state.runsLoaded = false; return; }
  runsUnsub = onSnapshot(collection(db, 'runs'), snap => {
    const r = [];
    snap.forEach(d => r.push({ id: d.id, ...d.data() }));
    state.runs = r;
    state.runsLoaded = true;
    render();
  }, err => console.error('runs listener error', err));
}

async function seedQuestionBank() {
  const batchSize = 400;
  const all = window.SEED_QUESTIONS || [];
  for (let i = 0; i < all.length; i += batchSize) {
    const batch = writeBatch(db);
    all.slice(i, i + batchSize).forEach(q => {
      batch.set(doc(db, 'questions', q.id), q);
    });
    await batch.commit();
  }
}

async function saveQuestionToDb(q) {
  await setDoc(doc(db, 'questions', q.id), sanitizeForFirestore(q));
}
async function deleteQuestionFromDb(id) {
  await deleteDoc(doc(db, 'questions', id));
  // also strip from any templates referencing it (both the flat list and any sections)
  const updates = state.templates.filter(t => (t.questionIds || []).includes(id));
  for (const t of updates) {
    const nextSections = (t.sections || []).map(s => ({ ...s, questionIds: s.questionIds.filter(x => x !== id) }));
    await updateDoc(doc(db, 'templates', t.id), sanitizeForFirestore({
      questionIds: t.questionIds.filter(x => x !== id),
      sections: nextSections
    }));
  }
}
async function saveTemplateToDb(t) {
  if (t.id) {
    const { id, ...rest } = t;
    await setDoc(doc(db, 'templates', id), sanitizeForFirestore(rest), { merge: true });
  } else {
    await addDoc(collection(db, 'templates'), sanitizeForFirestore({ name: t.name, description: t.description, frequency: t.frequency, questionIds: t.questionIds, createdAt: new Date().toISOString() }));
  }
}
async function deleteTemplateFromDb(id) { await deleteDoc(doc(db, 'templates', id)); }

async function saveLocationToDb(loc) {
  if (loc.id) {
    const { id, ...rest } = loc;
    await setDoc(doc(db, 'locations', id), sanitizeForFirestore(rest), { merge: true });
  } else {
    await addDoc(collection(db, 'locations'), sanitizeForFirestore({ name: loc.name, createdAt: new Date().toISOString() }));
  }
}
async function deleteLocationFromDb(id) { await deleteDoc(doc(db, 'locations', id)); }

async function submitRunToDb(run) {
  const { id, ...rest } = run;
  await addDoc(collection(db, 'runs'), rest);
}
async function deleteRunFromDb(id) { await deleteDoc(doc(db, 'runs', id)); }

/* =========================================================================
   AUTH
========================================================================= */

function openPasswordModal() {
  state.showPasswordModal = true;
  renderModal();
}
async function attemptAdminLogin(password) {
  const errEl = document.getElementById('pwError');
  try {
    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, password);
    state.showPasswordModal = false;
    renderModal();
  } catch (e) {
    if (errEl) errEl.textContent = 'Incorrect password. Try again.';
    console.error(e);
  }
}
function adminLogout() {
  signOut(auth);
}
onAuthStateChanged(auth, user => {
  state.isAdmin = !!user;
  subscribeRunsIfAdmin();
  if (state.isAdmin && state.pendingView) {
    state.view = state.pendingView;
    state.pendingView = null;
  } else if (!state.isAdmin && (state.view === 'reports' || state.view === 'settings')) {
    state.view = 'dashboard';
  }
  render();
});

/* =========================================================================
   NAV
========================================================================= */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', locked: false },
  { key: 'take', label: 'Take Assessment', locked: false },
  { key: 'reports', label: 'Reports', locked: true },
  { key: 'settings', label: 'Settings', locked: true }
];

function renderNav() {
  const nav = document.getElementById('navList');
  nav.innerHTML = NAV_ITEMS.map(it => `
    <button class="nav-item ${state.view === it.key ? 'active' : ''}" data-action="nav" data-view="${it.key}">
      ${esc(it.label)}
      ${it.locked && !state.isAdmin ? '<span class="lock">&#128274;</span>' : ''}
    </button>
  `).join('');

  const locEl = document.getElementById('locationIndicator');
  if (locEl) {
    locEl.innerHTML = state.selectedLocationName ? `
      <div style="padding:8px 10px 4px;">
        <div class="brand-sub" style="margin-bottom:2px;">Location</div>
        <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
          <span style="color:#fff;font-size:.85rem;font-weight:600;">${esc(state.selectedLocationName)}</span>
          <button data-action="change-location" style="background:none;border:none;color:#93a4c2;font-size:.72rem;text-decoration:underline;cursor:pointer;padding:0;">Change</button>
        </div>
      </div>
    ` : '';
  }

  const foot = document.getElementById('sidebarFoot');
  if (state.isAdmin) {
    foot.innerHTML = `<div>Signed in as admin</div><button data-action="logout">Sign out</button>`;
  } else {
    foot.innerHTML = '';
  }
}

function goToView(view) {
  if ((view === 'reports' || view === 'settings') && !state.isAdmin) {
    state.pendingView = view;
    openPasswordModal();
    return;
  }
  state.view = view;
  render();
}

/* =========================================================================
   SMALL RENDER HELPERS
========================================================================= */

function badgeHTML(severity) {
  return `<span class="badge badge-${severity}">${esc(severity)}</span>`;
}
function linksHTML(links) {
  if (!links || !links.length) return '';
  const real = links.filter(l => l && l.url && l.url.trim());
  if (!real.length) return '';
  return real.map(l => `<a class="q-pathway" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label || 'Link')}</a>`).join(' ');
}
function photoThumbsHTML(photos) {
  if (!photos || !photos.length) return '';
  return `<div class="ref-photos">${photos.map(p => `<img src="${esc(p.url)}" class="ref-photo-thumb" data-action="view-photo" data-url="${esc(p.url)}" alt="Reference photo" />`).join('')}</div>`;
}
function isItemComplete(r) {
  if (!r.options || r.options.length === 0) return true;
  if (r.answer == null) return false;
  if (isFailOption(r.answer) && !(r.notes && r.notes.trim())) return false;
  return true;
}
function stampHTML(grade, percent, size) {
  size = size || 90;
  const gradeSize = Math.round(size * 0.32);
  const pctSize = Math.max(Math.round(size * 0.1), 9);
  return `<div class="stamp" style="width:${size}px;height:${size}px;color:${gradeColorVar(grade)}">
    <div class="stamp-grade" style="font-size:${gradeSize}px">${esc(grade)}</div>
    <div class="stamp-percent" style="font-size:${pctSize}px">${percent}%</div>
  </div>`;
}
function statCardHTML(label, value) {
  return `<div class="stat-card"><div class="stat-value">${esc(value)}</div><div class="stat-label">${esc(label)}</div></div>`;
}
function emptyStateHTML(text) { return `<div class="empty-state"><p>${esc(text)}</p></div>`; }
function pageHeaderHTML(eyebrow, title, actionHTML) {
  return `<div class="page-header"><div><div class="eyebrow">${esc(eyebrow)}</div><h1>${esc(title)}</h1></div>${actionHTML || ''}</div>`;
}

/* =========================================================================
   LOCATION GATE
========================================================================= */

function renderLocationGate() {
  if (state.locations.length === 0) {
    return `
      <div class="banner"><h1>Which location is this?</h1><p>No locations have been set up yet.</p></div>
      ${emptyStateHTML('An admin needs to add at least one location before assessments can be taken. Click Settings in the sidebar to sign in and add one.')}
    `;
  }
  return `
    <div class="banner"><h1>Which location is this?</h1><p>Select your restaurant to continue. This device will remember your choice.</p></div>
    <div class="template-grid">
      ${state.locations.map(l => `
        <div class="template-card clickable" data-action="select-location" data-id="${esc(l.id)}">
          <h3>${esc(l.name)}</h3>
        </div>
      `).join('')}
    </div>
  `;
}

/* =========================================================================
   DASHBOARD
========================================================================= */

function renderDashboard() {
  if (!state.isAdmin) {
    return `
      ${pageHeaderHTML('Overview', 'SAFE Self-Assessments')}
      <div class="panel">
        <h3>Get started</h3>
        <p style="color:var(--ink-soft);font-size:.88rem;">Pick your location and run a self-assessment. Reports and question-bank management are available to admins.</p>
        <button class="btn btn-primary" data-action="nav" data-view="take">Start an assessment</button>
      </div>
      <div class="stat-grid">
        ${statCardHTML('Questions in library', state.questions.length)}
        ${statCardHTML('Templates', state.templates.length)}
        ${statCardHTML('Locations', state.locations.length)}
      </div>
    `;
  }

  const completed = state.runs.filter(r => r.status === 'completed');
  const avg = completed.length ? Math.round(completed.reduce((s, r) => s + r.score.percent, 0) / completed.length) : null;
  const criticalRuns = completed.filter(r => r.score.criticalFails > 0 && !r.acknowledged);
  const recent = completed.slice().sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt)).slice(0, 5);

  return `
    ${pageHeaderHTML('Overview', 'Dashboard')}
    <div class="stat-grid">
      ${statCardHTML('Questions in library', state.questions.length)}
      ${statCardHTML('Locations', state.locations.length)}
      ${statCardHTML('Completed assessments', completed.length)}
      ${statCardHTML('Average score', avg !== null ? avg + '%' : '\u2014')}
    </div>
    <div class="two-col">
      <section class="panel">
        <h3>Recent assessments</h3>
        ${recent.length === 0 ? emptyStateHTML('No completed assessments yet.') : `
          <ul class="run-list">
            ${recent.map(r => `
              <li class="run-row clickable" data-action="open-run" data-id="${r.id}">
                ${stampHTML(r.score.grade, r.score.percent, 46)}
                <div>
                  <div class="run-title">${esc(r.templateName)}</div>
                  <div class="run-meta">${esc(r.locationName || '\u2014')} &middot; ${fmtDate(r.date)} &middot; ${esc(r.assessorName || 'Unnamed')}</div>
                </div>
              </li>
            `).join('')}
          </ul>
        `}
      </section>
      <section class="panel">
        <h3>Quick actions</h3>
        <button class="btn btn-primary" data-action="nav" data-view="take">Start an assessment</button>
        ${criticalRuns.length > 0 ? `
          <div class="callout callout-danger" style="flex-direction:column;align-items:stretch;gap:8px;">
            <div style="display:flex;align-items:center;gap:8px;"><span>&#9888;</span> ${criticalRuns.length} assessment${criticalRuns.length > 1 ? 's need' : ' needs'} review for an IMMEDIATE item failure:</div>
            <ul class="run-list" style="margin:0;">
              ${criticalRuns.map(r => `
                <li class="run-row" style="border-top:1px solid rgba(212,61,61,.2);padding:8px 0;">
                  <div style="flex:1;">
                    <div class="run-title" data-action="open-run" data-id="${r.id}" style="cursor:pointer;">${esc(r.templateName)} &mdash; ${esc(r.locationName || '\u2014')}</div>
                    <div class="run-meta">${fmtDate(r.date)} &middot; ${esc(r.assessorName || 'Unnamed')}</div>
                  </div>
                  <button class="btn btn-ghost btn-sm" data-action="acknowledge-run" data-id="${r.id}">Mark reviewed</button>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </section>
    </div>
  `;
}

/* =========================================================================
   TAKE ASSESSMENT
========================================================================= */

function renderTake() {
  if (state.draftRun) {
    return state.takeStage === 'review' ? renderTakeReview() : renderTakeInProgress();
  }

  const drafts = loadLocalDrafts();

  return `
    ${pageHeaderHTML('Take Assessment', 'Choose a template')}
    ${drafts.length > 0 ? `
      <section class="panel">
        <h3>Resume a saved draft</h3>
        <ul class="run-list">
          ${drafts.map(d => `
            <li class="run-row">
              <div style="flex:1">
                <div class="run-title">${esc(d.templateName)}</div>
                <div class="run-meta">${esc(d.locationName || 'No location')} &middot; started ${fmtDate(d.createdAt)}</div>
              </div>
              <button class="btn btn-ghost btn-sm" data-action="resume-draft" data-id="${d.id}">Resume</button>
              <button class="icon-btn" data-action="discard-draft" data-id="${d.id}">&times;</button>
            </li>
          `).join('')}
        </ul>
      </section>
    ` : ''}
    ${state.templates.length === 0 ? emptyStateHTML('No templates yet. An admin needs to build one in Settings.') : `
      <div class="template-grid">
        ${state.templates.map(t => `
          <div class="template-card clickable" data-action="start-run" data-id="${t.id}">
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.description || '')}</p>
            <div class="template-meta">${(t.questionIds || []).length} questions ${t.frequency ? '&middot; ' + esc(t.frequency) : ''}</div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

function renderTakeInProgress() {
  const run = state.draftRun;
  const answered = run.responses.filter(isItemComplete).length;
  const total = run.responses.length;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const incompleteCount = total - answered;

  const bySection = {};
  run.responses.forEach(r => { (bySection[r.sectionName || r.category] = bySection[r.sectionName || r.category] || []).push(r); });

  return `
    ${pageHeaderHTML(run.templateName, 'Assessment in progress',
      `<button class="btn btn-ghost" data-action="cancel-draft">Choose different template</button>`)}

    <div class="panel meta-form">
      <div class="meta-field">
        <label>Location</label>
        <input value="${esc(run.locationName || 'Not set')}" disabled />
      </div>
      <div class="meta-field">
        <label>Assessor</label>
        <input id="metaAssessor" value="${esc(run.assessorName)}" placeholder="Your name" />
      </div>
      <div class="meta-field">
        <label>Date</label>
        <input id="metaDate" type="date" value="${esc(run.date)}" />
      </div>
    </div>

    <div class="progress-bar"><div class="progress-fill" id="progressFill" style="width:${pct}%"></div></div>
    <div class="progress-label" id="progressLabel">${answered} of ${total} complete</div>

    ${state.takeValidationAttempted && incompleteCount > 0 ? `
      <div class="callout callout-danger" id="submitWarning">
        <span>&#9888;</span> ${incompleteCount} question${incompleteCount > 1 ? 's' : ''} still need${incompleteCount > 1 ? '' : 's'} attention &mdash; highlighted below.
      </div>
    ` : ''}

    ${Object.keys(bySection).map(sec => `
      <section class="panel">
        <h3>${esc(sec)}</h3>
        ${groupByParent(bySection[sec]).map(g => renderTakeGroup(g)).join('')}
      </section>
    `).join('')}

    <div class="sticky-footer">
      <button class="btn btn-ghost" data-action="save-draft">Save draft</button>
      <button class="btn btn-primary" id="submitBtn" data-action="submit-run">Submit assessment</button>
    </div>
    <div class="hint">Answer every item to submit &mdash; "No" answers need a note. You can save a draft any time.</div>
  `;
}

function renderTakeReview() {
  const run = state.draftRun;
  const score = computeScore(run.responses);
  const failed = run.responses.filter(r => isFailOption(r.answer));

  return `
    ${pageHeaderHTML(run.templateName, 'Review & submit',
      `<button class="btn btn-ghost" data-action="back-to-filling">Back to assessment</button>`)}

    <div class="panel report-summary">
      ${stampHTML(score.grade, score.percent, 90)}
      <div class="report-meta">
        <div>${esc(run.assessorName || 'Unnamed')}</div>
        <div>${esc(run.locationName || 'No location')}</div>
        <div>${fmtDate(run.date)}</div>
        <div class="score-breakdown">${score.pass} passed &middot; ${score.fail} failed &middot; ${score.excluded} excluded${score.criticalFails > 0 ? ' &middot; ' + score.criticalFails + ' IMMEDIATE failure' + (score.criticalFails > 1 ? 's' : '') : ''}</div>
      </div>
    </div>

    ${failed.length === 0 ? `
      <div class="panel"><h3>Nothing missed &mdash; nice work.</h3><p style="color:var(--ink-soft);font-size:.88rem;margin:0;">Every item passed. You can still add a general note below before sending, or just confirm and submit.</p></div>
    ` : `
      <section class="panel">
        <h3>Missed questions (${failed.length}) &mdash; review notes before sending</h3>
        <ul class="q-list">
          ${failed.map(r => `
            <li class="q-row">
              <div class="q-main" style="width:100%;">
                <div class="q-card-badge-row">${badgeHTML(r.severity)} <span class="q-code">${esc(r.code)}</span></div>
                <div class="q-text">${esc(r.text)}</div>
                <textarea class="review-note-textarea" data-code="${esc(r.code)}" rows="2" placeholder="Corrective action or notes&hellip;">${esc(r.notes || '')}</textarea>
              </div>
            </li>
          `).join('')}
        </ul>
      </section>
    `}

    <div class="sticky-footer">
      <button class="btn btn-ghost" data-action="back-to-filling">Back to assessment</button>
      <button class="btn btn-primary" data-action="confirm-send-slack">Confirm &amp; send to Slack</button>
    </div>
    <div class="hint">This sends a summary of missed questions to Slack, then submits the assessment.</div>
  `;
}

function buildSlackPayload(run, score) {
  const failed = run.responses.filter(r => isFailOption(r.answer));
  const lines = failed.map(r => '\u2022 [' + r.severity + '] ' + r.code + ': ' + r.text + (r.notes ? '\n   note: ' + r.notes : ''));
  return {
    text:
      'SAFE Assessment submitted \u2014 ' + (run.locationName || 'Unknown location') + '\n' +
      'Template: ' + run.templateName + '\n' +
      'Assessor: ' + (run.assessorName || 'Unnamed') + '\n' +
      'Date: ' + run.date + '\n' +
      'Score: ' + score.grade + ' (' + score.percent + '%)' + (score.criticalFails ? ' \u2014 ' + score.criticalFails + ' IMMEDIATE failure(s)' : '') + '\n\n' +
      (failed.length ? 'Missed questions (' + failed.length + '):\n' + lines.join('\n') : 'No missed questions \u2014 great job!')
  };
}

function runSlackSendSequence(payload, onDone) {
  // NOTE: this is simulated on purpose (per request, to validate the flow
  // before wiring a real webhook). Swap the setTimeout stages below for an
  // actual fetch() to your Slack Incoming Webhook URL when ready — see
  // SETUP.md for the security caveat about calling webhooks from the client.
  console.log('[Slack webhook simulation] Would send:', payload);
  state.showingSlackAnim = true;
  const root = document.getElementById('modalRoot');
  root.innerHTML = `
    <div class="modal-overlay">
      <div class="modal slack-send-modal">
        <div class="modal-body slack-anim">
          <div class="slack-icon-wrap" id="slackIconWrap">
            <div class="slack-icon-pulse"></div>
            <div class="slack-icon">&#128172;</div>
          </div>
          <div class="slack-status" id="slackStatus">Preparing summary&hellip;</div>
        </div>
      </div>
    </div>
  `;
  setTimeout(() => {
    const s = document.getElementById('slackStatus');
    if (s) s.textContent = 'Sending to Slack\u2026';
  }, 650);
  setTimeout(() => {
    const wrap = document.getElementById('slackIconWrap');
    const s = document.getElementById('slackStatus');
    if (wrap) wrap.classList.add('done');
    if (s) s.innerHTML = 'Sent <span class="pill-outline">simulated \u2014 no webhook connected yet</span>';
  }, 1500);
  setTimeout(() => {
    document.getElementById('modalRoot').innerHTML = '';
    state.showingSlackAnim = false;
    onDone();
  }, 2300);
}

function showPhotoLightbox(url) {
  state.showingLightbox = true;
  document.getElementById('modalRoot').innerHTML = `
    <div class="modal-overlay" data-action="close-lightbox">
      <div class="lightbox-content">
        <img src="${esc(url)}" alt="Reference photo" />
        <button class="icon-btn lightbox-close" data-action="close-lightbox">&times;</button>
      </div>
    </div>
  `;
}

function groupByParent(items) {
  const groups = [];
  const map = {};
  items.forEach(it => {
    const key = it.parentCode || it.code;
    if (!map[key]) {
      map[key] = {
        parentCode: it.parentCode, parentText: it.parentText,
        parentGuidance: it.parentGuidance, parentLinks: it.parentLinks || [], parentPhotos: it.parentPhotos || [],
        items: []
      };
      groups.push(map[key]);
    }
    map[key].items.push(it);
  });
  return groups;
}

function renderTakeGroup(g) {
  const isGroup = !!g.parentCode;
  const first = g.items[0];
  const anyIncomplete = state.takeValidationAttempted && g.items.some(it => !isItemComplete(it));
  return `
    <details class="q-card sev-${first.severity}" ${anyIncomplete ? 'open' : ''}>
      <summary class="q-card-head">
        <div class="q-card-main">
          <div class="q-card-badge-row">${badgeHTML(first.severity)} <span class="q-code">${esc(isGroup ? g.parentCode : first.code)}</span></div>
          <div class="q-text">${esc(isGroup ? g.parentText : first.text)} ${linksHTML(isGroup ? g.parentLinks : first.links)}</div>
          ${isGroup && g.parentGuidance ? `<div class="q-guidance">${esc(g.parentGuidance)}</div>` : ''}
          ${photoThumbsHTML(isGroup ? g.parentPhotos : first.photos)}
        </div>
        <span class="chev">&#9662;</span>
      </summary>
      <div class="q-card-body">
        ${g.items.map(it => renderTakeItem(it)).join('')}
      </div>
    </details>
  `;
}

function renderTakeItem(it) {
  const hasOptions = it.options && it.options.length > 0;
  const complete = isItemComplete(it);
  const missing = state.takeValidationAttempted && !complete;
  const needsNote = isFailOption(it.answer) && !(it.notes && it.notes.trim());
  return `
    <div class="child-item ${it.answer != null ? 'answered' : ''} ${missing ? 'missing' : ''}" data-code="${esc(it.code)}">
      ${it.isChild ? `<div class="q-text">${esc(it.text)} ${linksHTML(it.links)}</div>` : ''}
      ${it.guidance ? `<div class="q-guidance">${esc(it.guidance)}</div>` : ''}
      ${photoThumbsHTML(it.photos)}
      ${hasOptions ? `
        <div class="option-group" data-code="${esc(it.code)}">
          ${it.options.map(opt => {
            const cls = isPassOption(opt) ? 'opt-pass' : isFailOption(opt) ? 'opt-fail' : 'opt-neutral';
            const active = it.answer === opt ? ' active' : '';
            return `<button type="button" class="opt-btn ${cls}${active}" data-action="answer" data-code="${esc(it.code)}" data-option="${esc(opt)}">${esc(opt)}</button>`;
          }).join('')}
          ${it.answer != null ? '<span class="answered-check" title="Answered">&#10003;</span>' : ''}
        </div>
      ` : `<div class="hint">No pass/fail options for this item &mdash; use notes to record what you observed.</div>`}
      <div class="notes-row">
        <button type="button" class="notes-toggle" data-action="toggle-notes" data-code="${esc(it.code)}">+ Add notes</button>
        <span class="note-required-flag" id="note-required-${esc(it.code)}" style="display:${needsNote ? 'inline' : 'none'}">Note required for a "No" answer</span>
      </div>
      <div class="notes-input" id="notes-wrap-${esc(it.code)}" style="display:${(it.notes || needsNote) ? 'block' : 'none'}">
        <textarea rows="2" placeholder="Observations or corrective action&hellip;" data-code="${esc(it.code)}" class="notes-textarea">${esc(it.notes || '')}</textarea>
      </div>
      ${missing ? `<div class="missing-flag">${it.answer == null ? 'This question still needs an answer.' : 'Add a note to explain this "No" before submitting.'}</div>` : ''}
    </div>
  `;
}

function findResponse(code) {
  return state.draftRun.responses.find(r => r.code === code);
}

function updateProgressUI() {
  const run = state.draftRun;
  const answered = run.responses.filter(isItemComplete).length;
  const total = run.responses.length;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = answered + ' of ' + total + ' complete';
}

function refreshItemState(code) {
  const r = findResponse(code);
  if (!r) return;
  const item = document.querySelector('.child-item[data-code="' + cssId(code) + '"]');
  const flag = document.getElementById('note-required-' + code);
  const needsNote = isFailOption(r.answer) && !(r.notes && r.notes.trim());
  if (flag) flag.style.display = needsNote ? 'inline' : 'none';
  if (item) {
    item.classList.toggle('answered', r.answer != null);
    if (state.takeValidationAttempted) {
      item.classList.toggle('missing', !isItemComplete(r));
    }
  }
  updateProgressUI();
}
function cssId(s) { return String(s).replace(/"/g, '\\"'); }

/* =========================================================================
   SETTINGS: LIBRARY / TEMPLATES / LOCATIONS
========================================================================= */

function renderSettings() {
  const tabs = [
    { key: 'library', label: 'Question Library' },
    { key: 'templates', label: 'Build Assessment' },
    { key: 'locations', label: 'Locations' }
  ];
  return `
    ${pageHeaderHTML('Settings', 'Manage your SAFE program')}
    <div class="filter-bar">
      ${tabs.map(t => `<button class="btn ${state.settingsTab === t.key ? 'btn-primary' : 'btn-ghost'} btn-sm" data-action="settings-tab" data-tab="${t.key}">${esc(t.label)}</button>`).join('')}
    </div>
    <div id="settingsBody">${renderSettingsBody()}</div>
  `;
}

function renderSettingsBody() {
  if (state.settingsTab === 'library') return renderLibraryTab();
  if (state.settingsTab === 'templates') return renderTemplatesTab();
  if (state.settingsTab === 'locations') return renderLocationsTab();
  return '';
}

function renderLibraryTab() {
  if (state.questions.length === 0) {
    return `
      <div class="panel">
        <h3>Question bank is empty</h3>
        <p style="color:var(--ink-soft);font-size:.88rem;">Load the starter bank (parsed from your Ops Hub Daily export) to get going, or add your own questions one at a time.</p>
        <button class="btn btn-primary" data-action="seed-bank">Load starter question bank</button>
        <button class="btn btn-ghost" data-action="add-question" style="margin-left:8px;">Add a question</button>
      </div>
    `;
  }
  return `
    <div class="filter-bar">
      <div class="search-box">
        <input id="libSearch" placeholder="Search questions&hellip;" oninput="window.__libFilter()" />
      </div>
      <select id="libCatFilter" onchange="window.__libFilter()">
        <option value="all">All categories</option>
        ${state.categories.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
      </select>
      <select id="libSevFilter" onchange="window.__libFilter()">
        <option value="all">All severities</option>
        <option value="IMMEDIATE">Immediate</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
      <button class="btn btn-primary" data-action="add-question">Add question</button>
    </div>
    <div id="libListContainer">${buildLibraryListHTML('', 'all', 'all')}</div>
  `;
}

function buildLibraryListHTML(search, catFilter, sevFilter) {
  const s = (search || '').toLowerCase();
  const filtered = state.questions.filter(q => {
    if (catFilter !== 'all' && q.category !== catFilter) return false;
    if (sevFilter !== 'all' && q.severity !== sevFilter) return false;
    if (s) {
      const hay = (q.text + ' ' + (q.guidance || '') + ' ' + (q.children || []).map(c => c.text).join(' ')).toLowerCase();
      if (!hay.includes(s)) return false;
    }
    return true;
  });
  const byCat = {};
  filtered.forEach(q => (byCat[q.category] = byCat[q.category] || []).push(q));

  if (filtered.length === 0) return emptyStateHTML('No questions match your filters.');

  return Object.keys(byCat).map(cat => `
    <section class="panel">
      <h3>${esc(cat)} <span class="pill-outline">${byCat[cat].length}</span></h3>
      <ul class="q-list">
        ${byCat[cat].map(q => `
          <li class="q-row">
            <div class="q-main">
              <div class="q-card-badge-row">${badgeHTML(q.severity)} <span class="q-code">${esc(q.id)}</span></div>
              <div class="q-text">${esc(q.text)}</div>
              ${q.guidance ? `<div class="q-guidance">${esc(q.guidance)}</div>` : ''}
              ${(q.children || []).length ? `<div class="q-guidance">${q.children.length} sub-question${q.children.length > 1 ? 's' : ''}: ${q.children.map(c => esc(c.id)).join(', ')}</div>` : ''}
              ${photoThumbsHTML(q.photos)}
            </div>
            <div class="q-actions">
              <button class="icon-btn" data-action="edit-question" data-id="${esc(q.id)}" title="Edit">&#9998;</button>
              <button class="icon-btn" data-action="delete-question" data-id="${esc(q.id)}" title="Delete">&times;</button>
            </div>
          </li>
        `).join('')}
      </ul>
    </section>
  `).join('');
}

window.__libFilter = function () {
  const search = document.getElementById('libSearch').value;
  const cat = document.getElementById('libCatFilter').value;
  const sev = document.getElementById('libSevFilter').value;
  document.getElementById('libListContainer').innerHTML = buildLibraryListHTML(search, cat, sev);
};

function renderTemplatesTab() {
  if (state.editingTemplate) return renderTemplateEditor();
  return `
    <div class="filter-bar">
      <button class="btn btn-primary" data-action="new-template">New template</button>
    </div>
    ${state.templates.length === 0 ? emptyStateHTML('No templates yet.') : `
      <div class="template-grid">
        ${state.templates.map(t => `
          <div class="template-card">
            <h3>${esc(t.name)}</h3>
            <p>${esc(t.description || '')}</p>
            <div class="template-meta">${(t.questionIds || []).length} questions ${t.frequency ? '&middot; ' + esc(t.frequency) : ''}</div>
            <div class="template-actions">
              <button class="btn btn-ghost btn-sm" data-action="edit-template" data-id="${esc(t.id)}">Edit</button>
              <button class="btn btn-ghost btn-sm" data-action="delete-template" data-id="${esc(t.id)}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

let sectionsDraft = [];
let sortableInstances = [];

function renderTemplateEditor() {
  const t = state.editingTemplate === 'new' ? { name: '', description: '', frequency: 'Daily', questionIds: [] } : state.editingTemplate;
  const frequencies = ['Daily', 'Weekly', 'Bi-Weekly', 'Monthly', 'Quarterly', 'As Needed'];

  return `
    <div class="panel">
      <label class="field-label">Template name</label>
      <input id="tplName" value="${esc(t.name)}" placeholder="e.g. Full SAFE Assessment" />
      <label class="field-label">Description</label>
      <textarea id="tplDesc" rows="2" placeholder="When and why this gets used.">${esc(t.description || '')}</textarea>
      <label class="field-label">How often should this be performed?</label>
      <select id="tplFrequency">
        ${frequencies.map(f => `<option value="${f}" ${(t.frequency || 'Daily') === f ? 'selected' : ''}>${f}</option>`).join('')}
      </select>
    </div>
    <div class="filter-bar">
      <button class="btn ${state.templateEditorTab !== 'arrange' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-action="template-editor-tab" data-tab="select">1. Choose questions</button>
      <button class="btn ${state.templateEditorTab === 'arrange' ? 'btn-primary' : 'btn-ghost'} btn-sm" data-action="template-editor-tab" data-tab="arrange">2. Arrange order</button>
      <div class="pill-outline" id="tplSelCount" style="margin-left:auto;">${window.__templateSelection.size} selected</div>
    </div>
    <div id="templateEditorBody">
      ${state.templateEditorTab === 'arrange' ? renderArrangeTab() : renderSelectTab()}
    </div>
    <div class="sticky-footer">
      <button class="btn btn-ghost" data-action="cancel-template-edit">Cancel</button>
      <button class="btn btn-primary" data-action="save-template" data-id="${t.id || ''}">Save template</button>
    </div>
  `;
}

function renderSelectTab() {
  return `
    <div class="filter-bar">
      <div class="search-box"><input id="tplSearch" placeholder="Search questions&hellip;" oninput="window.__tplFilter()" /></div>
      <select id="tplCatFilter" onchange="window.__tplFilter()">
        <option value="all">All categories</option>
        ${state.categories.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
      </select>
      <select id="tplSevFilter" onchange="window.__tplFilter()">
        <option value="all">All severities</option>
        <option value="IMMEDIATE">Immediate</option>
        <option value="HIGH">High</option>
        <option value="MEDIUM">Medium</option>
        <option value="LOW">Low</option>
      </select>
    </div>
    <div id="tplListContainer">${buildTemplateSelectHTML('', 'all', 'all')}</div>
  `;
}

function buildTemplateSelectHTML(search, catFilter, sevFilter) {
  const s = (search || '').toLowerCase();
  const filtered = state.questions.filter(q => {
    if (catFilter !== 'all' && q.category !== catFilter) return false;
    if (sevFilter && sevFilter !== 'all' && q.severity !== sevFilter) return false;
    if (s && !q.text.toLowerCase().includes(s)) return false;
    return true;
  });
  const byCat = {};
  filtered.forEach(q => (byCat[q.category] = byCat[q.category] || []).push(q));

  return Object.keys(byCat).map(cat => {
    const ids = byCat[cat].map(q => q.id);
    const allSelected = ids.every(id => window.__templateSelection.has(id));
    return `
      <section class="panel">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
          <h3 style="margin:0;">${esc(cat)}</h3>
          <button class="btn btn-ghost btn-sm" data-action="toggle-cat-select" data-ids="${esc(ids.join(','))}">${allSelected ? 'Deselect all' : 'Select all'}</button>
        </div>
        <ul class="q-list">
          ${byCat[cat].map(q => `
            <li class="q-row selectable" data-action="toggle-question-select" data-id="${esc(q.id)}">
              <input type="checkbox" ${window.__templateSelection.has(q.id) ? 'checked' : ''} readonly />
              <div class="q-main">
                <div class="q-card-badge-row">${badgeHTML(q.severity)} <span class="q-code">${esc(q.id)}</span></div>
                <div class="q-text">${esc(q.text)}</div>
              </div>
            </li>
          `).join('')}
        </ul>
      </section>
    `;
  }).join('');
}

window.__tplFilter = function () {
  const search = document.getElementById('tplSearch').value;
  const cat = document.getElementById('tplCatFilter').value;
  const sev = document.getElementById('tplSevFilter') ? document.getElementById('tplSevFilter').value : 'all';
  document.getElementById('tplListContainer').innerHTML = buildTemplateSelectHTML(search, cat, sev);
  document.getElementById('tplSelCount').textContent = window.__templateSelection.size + ' selected';
};

/* ---- Arrange tab: freely reorderable, drag-and-drop sections ---- */

function reconcileSections() {
  const selected = window.__templateSelection;
  sectionsDraft.forEach(s => { s.questionIds = s.questionIds.filter(id => selected.has(id)); });
  const placed = new Set(sectionsDraft.flatMap(s => s.questionIds));
  const newly = Array.from(selected).filter(id => !placed.has(id));
  if (newly.length) {
    if (sectionsDraft.length === 0) {
      const byCat = {};
      newly.forEach(id => {
        const q = state.questions.find(x => x.id === id);
        const cat = q ? q.category : 'Uncategorized';
        (byCat[cat] = byCat[cat] || []).push(id);
      });
      state.categories.forEach(c => { if (byCat[c]) sectionsDraft.push({ id: uid('sec'), name: c, questionIds: byCat[c] }); });
      Object.keys(byCat).forEach(c => { if (!state.categories.includes(c)) sectionsDraft.push({ id: uid('sec'), name: c, questionIds: byCat[c] }); });
    } else {
      let unassigned = sectionsDraft.find(s => s.id === '__unassigned__');
      if (!unassigned) { unassigned = { id: '__unassigned__', name: 'Unassigned', questionIds: [] }; sectionsDraft.push(unassigned); }
      unassigned.questionIds.push(...newly);
    }
  }
  sectionsDraft = sectionsDraft.filter(s => s.questionIds.length > 0 || s.id !== '__unassigned__');
}

function renderArrangeTab() {
  reconcileSections();
  const sortableMissing = typeof Sortable === 'undefined';
  return `
    <p style="color:var(--ink-soft);font-size:.85rem;margin:0 0 12px;">Drag questions to reorder them or move them between sections &mdash; e.g. to match the physical path through your kitchen. Drag a section's grip handle to reorder whole sections. This becomes the order your team sees when taking the assessment.</p>
    ${sortableMissing ? `<div class="callout callout-danger">Drag-and-drop didn't load (check your internet connection and reload the page) &mdash; question selection still works, but reordering won't until this loads.</div>` : ''}
    <div id="sectionsContainer" class="sections-list">
      ${sectionsDraft.map(s => renderSectionBlock(s)).join('')}
    </div>
    <button class="btn btn-ghost btn-sm" data-action="add-section">+ Add section</button>
  `;
}

function renderSectionBlock(s) {
  return `
    <div class="section-block ${s.id === '__unassigned__' ? 'unassigned' : ''}" data-section-id="${esc(s.id)}">
      <div class="section-header">
        <span class="section-drag-handle" title="Drag to reorder this section">&#8942;&#8942;</span>
        ${s.id === '__unassigned__'
          ? `<span class="section-name-label">Unassigned <span class="pill-outline">not yet in a section</span></span>`
          : `<input class="section-name-input" value="${esc(s.name)}" placeholder="Section name (e.g. Walk-in Cooler)" />`}
        ${s.id !== '__unassigned__' ? `<button class="icon-btn" data-action="delete-section" data-section-id="${esc(s.id)}" title="Delete section">&times;</button>` : ''}
      </div>
      <ul class="section-questions" data-section-id="${esc(s.id)}">
        ${s.questionIds.map(qid => {
          const q = state.questions.find(x => x.id === qid);
          if (!q) return '';
          return `
            <li class="arrange-row" data-qid="${esc(qid)}">
              <span class="drag-handle">&#8942;&#8942;</span>
              ${badgeHTML(q.severity)}
              <span class="q-code">${esc(qid)}</span>
              <span class="arrange-text">${esc(q.text)}</span>
            </li>
          `;
        }).join('')}
      </ul>
    </div>
  `;
}

function readSectionsFromDom() {
  const blocks = document.querySelectorAll('#sectionsContainer .section-block');
  if (!blocks.length) return sectionsDraft;
  const next = [];
  blocks.forEach(block => {
    const id = block.getAttribute('data-section-id');
    const nameInput = block.querySelector('.section-name-input');
    const name = id === '__unassigned__' ? 'Unassigned' : (nameInput ? nameInput.value.trim() : '');
    const qids = Array.from(block.querySelectorAll('.arrange-row')).map(r => r.getAttribute('data-qid'));
    next.push({ id, name, questionIds: qids });
  });
  return next;
}

function initArrangeSortables() {
  sortableInstances.forEach(s => s.destroy());
  sortableInstances = [];
  if (typeof Sortable === 'undefined') return;
  const container = document.getElementById('sectionsContainer');
  if (!container) return;
  sortableInstances.push(new Sortable(container, { animation: 150, handle: '.section-drag-handle' }));
  container.querySelectorAll('.section-questions').forEach(ul => {
    sortableInstances.push(new Sortable(ul, { group: 'template-questions', animation: 150, handle: '.drag-handle' }));
  });
}

function renderLocationsTab() {
  return `
    <div class="filter-bar">
      <button class="btn btn-primary" data-action="new-location">Add location</button>
    </div>
    ${state.locations.length === 0 ? emptyStateHTML('No locations yet. Add one so people can pick it when taking an assessment.') : `
      <div class="panel">
        <ul class="loc-list">
          ${state.locations.map(l => `
            <li class="loc-row">
              <span>${esc(l.name)}</span>
              <span>
                <button class="icon-btn" data-action="edit-location" data-id="${esc(l.id)}">&#9998;</button>
                <button class="icon-btn" data-action="delete-location" data-id="${esc(l.id)}">&times;</button>
              </span>
            </li>
          `).join('')}
        </ul>
      </div>
    `}
  `;
}

/* =========================================================================
   REPORTS
========================================================================= */

function renderReports() {
  return `
    ${pageHeaderHTML('Reports', 'Assessment history', `<button class="btn btn-ghost" data-action="export-csv">Export CSV</button>`)}
    <div class="filter-bar">
      <div class="search-box"><input id="repSearch" placeholder="Search location or assessor&hellip;" oninput="window.__repFilter()" /></div>
      <select id="repLocFilter" onchange="window.__repFilter()">
        <option value="all">All locations</option>
        ${state.locations.map(l => `<option value="${esc(l.id)}">${esc(l.name)}</option>`).join('')}
      </select>
      <select id="repStatusFilter" onchange="window.__repFilter()">
        <option value="completed">Completed</option>
        <option value="all">All</option>
      </select>
    </div>
    <div id="repBody">${buildReportsBodyHTML('', 'all', 'completed')}</div>
  `;
}

function buildReportsBodyHTML(search, locFilter, statusFilter) {
  const s = (search || '').toLowerCase();
  const filtered = state.runs.filter(r => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (locFilter !== 'all' && r.locationId !== locFilter) return false;
    if (s && !((r.locationName || '').toLowerCase().includes(s) || (r.assessorName || '').toLowerCase().includes(s))) return false;
    return true;
  }).sort((a, b) => new Date(b.date) - new Date(a.date));

  const completed = filtered.filter(r => r.status === 'completed');
  const avg = completed.length ? Math.round(completed.reduce((s2, r) => s2 + r.score.percent, 0) / completed.length) : null;
  const critFails = completed.filter(r => r.score.criticalFails > 0).length;

  window.__reportsFiltered = filtered;

  let html = `
    <div class="stat-grid">
      ${statCardHTML('Assessments shown', filtered.length)}
      ${statCardHTML('Average score', avg !== null ? avg + '%' : '\u2014')}
      ${statCardHTML('Critical (IMMEDIATE) failures', critFails)}
      ${statCardHTML('Locations', state.locations.length)}
    </div>
  `;

  if (filtered.length === 0) {
    html += emptyStateHTML('No assessments match your filters.');
    return html;
  }

  html += `
    <div class="panel table-panel">
      <table class="report-table">
        <thead><tr><th>Date</th><th>Template</th><th>Location</th><th>Assessor</th><th>Score</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${filtered.map(r => `
            <tr class="clickable" data-action="open-run" data-id="${r.id}">
              <td>${fmtDate(r.date)}</td>
              <td>${esc(r.templateName)}</td>
              <td>${esc(r.locationName || '\u2014')}</td>
              <td>${esc(r.assessorName || '\u2014')}</td>
              <td>${r.status === 'completed' ? `<span class="grade-pill" style="color:${gradeColorVar(r.score.grade)};border-color:${gradeColorVar(r.score.grade)}">${esc(r.score.grade)} &middot; ${r.score.percent}%</span> ${r.score.criticalFails > 0 && !r.acknowledged ? '<span class="status-pill" style="background:rgba(212,61,61,.12);color:var(--danger);margin-left:4px;">Needs review</span>' : ''}` : '\u2014'}</td>
              <td><span class="status-pill status-${r.status}">${r.status === 'completed' ? 'Completed' : 'Draft'}</span></td>
              <td><button class="icon-btn" data-action="delete-run" data-id="${r.id}">&times;</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  return html;
}

window.__repFilter = function () {
  const search = document.getElementById('repSearch').value;
  const loc = document.getElementById('repLocFilter').value;
  const status = document.getElementById('repStatusFilter').value;
  document.getElementById('repBody').innerHTML = buildReportsBodyHTML(search, loc, status);
};

function renderRunDetail() {
  const run = state.runs.find(r => r.id === state.activeRunId);
  if (!run) return emptyStateHTML('Assessment not found.');
  const failed = run.responses.filter(r => isFailOption(r.answer));
  const byCategory = {};
  run.responses.forEach(r => (byCategory[r.sectionName || r.category] = byCategory[r.sectionName || r.category] || []).push(r));

  return `
    ${pageHeaderHTML('Report', run.templateName, `
      <div class="header-actions">
        <button class="btn btn-ghost" data-action="nav" data-view="reports">Back</button>
        <button class="btn btn-ghost" data-action="print">Print</button>
      </div>
    `)}
    <div class="panel report-summary">
      ${stampHTML(run.score.grade, run.score.percent, 100)}
      <div class="report-meta">
        <div>${esc(run.assessorName || 'Unnamed')}</div>
        <div>${esc(run.locationName || 'No location')}</div>
        <div>${fmtDate(run.date)}</div>
        <div class="score-breakdown">${run.score.pass} passed &middot; ${run.score.fail} failed &middot; ${run.score.excluded} excluded${run.score.criticalFails > 0 ? ' &middot; ' + run.score.criticalFails + ' IMMEDIATE failure' + (run.score.criticalFails > 1 ? 's' : '') : ''}</div>
        ${run.score.criticalFails > 0 ? (
          run.acknowledged
            ? `<div style="margin-top:6px;"><span class="status-pill status-completed">&#10003; Reviewed</span> <button class="btn btn-ghost btn-sm" data-action="unacknowledge-run" data-id="${run.id}" style="margin-left:6px;">Undo</button></div>`
            : `<button class="btn btn-primary btn-sm" data-action="acknowledge-run" data-id="${run.id}" style="margin-top:6px;">Mark reviewed</button>`
        ) : ''}
      </div>
    </div>
    ${failed.length > 0 ? `
      <section class="panel">
        <h3>Items needing attention</h3>
        <ul class="q-list">
          ${failed.map(r => `
            <li class="q-row">
              <div class="q-main">
                <div class="q-card-badge-row">${badgeHTML(r.severity)} <span class="q-code">${esc(r.code)}</span></div>
                <div class="q-text">${esc(r.text)}</div>
                ${r.notes ? `<div class="q-guidance">Note: ${esc(r.notes)}</div>` : ''}
              </div>
            </li>
          `).join('')}
        </ul>
      </section>
    ` : ''}
    ${Object.keys(byCategory).map(cat => `
      <section class="panel">
        <h3>${esc(cat)}</h3>
        ${byCategory[cat].map(r => `
          <div class="child-item">
            <span class="pill-outline">${r.options.length ? esc(r.answer || '\u2014') : 'notes only'}</span>
            <span class="q-text">${esc(r.text)}</span>
          </div>
        `).join('')}
      </section>
    `).join('')}
  `;
}

/* =========================================================================
   MODALS
========================================================================= */

function renderModal() {
  if (state.showingSlackAnim || state.showingLightbox) return;
  const root = document.getElementById('modalRoot');
  if (state.showPasswordModal) {
    root.innerHTML = `
      <div class="modal-overlay" data-action="close-modal-overlay">
        <div class="modal password-modal">
          <div class="modal-header"><h3>Admin access</h3><button class="icon-btn" data-action="close-modal">&times;</button></div>
          <div class="modal-body">
            <p style="color:var(--ink-soft);font-size:.85rem;">Enter the password to view Reports and Settings.</p>
            <input type="password" id="pwInput" placeholder="Password" autofocus />
            <div class="modal-error" id="pwError"></div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
            <button class="btn btn-primary" data-action="submit-password">Sign in</button>
          </div>
        </div>
      </div>
    `;
    setTimeout(() => { const el = document.getElementById('pwInput'); if (el) el.focus(); }, 0);
    return;
  }
  if (state.editingQuestion) { root.innerHTML = questionModalHTML(); return; }
  if (state.editingLocation) { root.innerHTML = locationModalHTML(); return; }
  root.innerHTML = '';
}

let qDraft = null;

function startQuestionEdit(question) {
  if (question === 'new' || question == null) {
    qDraft = { id: '', category: state.categories[0] || '', severity: 'MEDIUM', text: '', guidance: '', options: ['Yes', 'No'], links: [], photos: [], children: [] };
  } else {
    qDraft = JSON.parse(JSON.stringify(question));
    if (!qDraft.links) qDraft.links = [];
    if (!qDraft.photos) qDraft.photos = [];
    if (!qDraft.children) qDraft.children = [];
    qDraft.children.forEach(c => { if (!c.links) c.links = []; if (!c.photos) c.photos = []; });
  }
}

function linksEditorHTML(links, scope) {
  return `
    <div class="links-editor" data-scope="${scope}">
      ${(links || []).map((l, i) => `
        <div class="link-row">
          <input class="link-label" placeholder="Link name (e.g. SOP)" value="${esc(l.label || '')}" />
          <input class="link-url" placeholder="https://&hellip;" value="${esc(l.url || '')}" />
          <button type="button" class="icon-btn" data-action="remove-link" data-scope="${scope}" data-index="${i}">&times;</button>
        </div>
      `).join('')}
      <button type="button" class="btn btn-ghost btn-sm" data-action="add-link" data-scope="${scope}">+ Add link</button>
    </div>
  `;
}

function photosEditorHTML(photos, scope) {
  return `
    <div class="photos-editor">
      ${(photos || []).map((p, i) => `
        <div class="photo-thumb">
          <img src="${esc(p.url)}" alt="Reference photo" />
          <button type="button" class="icon-btn photo-remove" data-action="remove-photo" data-scope="${scope}" data-index="${i}" title="Remove photo">&times;</button>
        </div>
      `).join('')}
    </div>
    <div class="photo-add-row">
      <input type="text" class="photo-path-input" data-scope="${scope}" placeholder="photos/scoop-handles.jpg" />
      <button type="button" class="btn btn-ghost btn-sm" data-action="add-photo-path" data-scope="${scope}">+ Add photo</button>
    </div>
    <p class="photo-hint">Upload the image file to a <code>photos/</code> folder in your GitHub repo first, then paste its filename here (e.g. <code>photos/scoop-handles.jpg</code>).</p>
  `;
}

function childEditorHTML(child, idx) {
  return `
    <div class="child-editor-row" data-child-index="${idx}">
      <div class="child-editor-head">
        <span class="pill-outline">${esc(child.id || 'new sub-question')}</span>
        <button type="button" class="icon-btn" data-action="remove-child" data-index="${idx}">&times;</button>
      </div>
      <label class="field-label">Sub-question code</label>
      <input class="child-id" value="${esc(child.id || '')}" placeholder="e.g. SDC.999.a" />
      <label class="field-label">Text</label>
      <textarea class="child-text" rows="2">${esc(child.text || '')}</textarea>
      <label class="field-label">Guidance (optional)</label>
      <textarea class="child-guidance" rows="2">${esc(child.guidance || '')}</textarea>
      <label class="field-label">Answer options (comma-separated, blank = notes only)</label>
      <input class="child-options" value="${esc((child.options || []).join(', '))}" placeholder="Yes, No, Not Observable" />
      <label class="field-label">Links</label>
      ${linksEditorHTML(child.links, 'child-' + idx)}
      <label class="field-label">Reference photos</label>
      ${photosEditorHTML(child.photos, 'child-' + idx)}
    </div>
  `;
}

function syncQuestionDraftFromDom() {
  if (!qDraft) return;
  const catEl = document.getElementById('qCategory');
  const sevEl = document.getElementById('qSeverity');
  const textEl = document.getElementById('qText');
  const guidanceEl = document.getElementById('qGuidance');
  const optsEl = document.getElementById('qOptions');
  const idEl = document.getElementById('qId');
  if (idEl) qDraft.id = idEl.value.trim();
  if (catEl) qDraft.category = catEl.value;
  if (sevEl) qDraft.severity = sevEl.value;
  if (textEl) qDraft.text = textEl.value;
  if (guidanceEl) qDraft.guidance = guidanceEl.value;
  if (optsEl) qDraft.options = optsEl.value.split(',').map(s => s.trim()).filter(Boolean);

  qDraft.links = readLinksEditor('parent');

  document.querySelectorAll('.child-editor-row').forEach(row => {
    const idx = parseInt(row.getAttribute('data-child-index'), 10);
    const c = qDraft.children[idx];
    if (!c) return;
    c.id = row.querySelector('.child-id').value.trim();
    c.text = row.querySelector('.child-text').value;
    c.guidance = row.querySelector('.child-guidance').value;
    c.options = row.querySelector('.child-options').value.split(',').map(s => s.trim()).filter(Boolean);
    c.links = readLinksEditor('child-' + idx);
  });
}

function readLinksEditor(scope) {
  const container = document.querySelector('.links-editor[data-scope="' + scope + '"]');
  if (!container) return [];
  const rows = container.querySelectorAll('.link-row');
  const links = [];
  rows.forEach(row => {
    const label = row.querySelector('.link-label').value.trim();
    const url = row.querySelector('.link-url').value.trim();
    if (label || url) links.push({ label, url });
  });
  return links;
}


function questionModalHTML() {
  const isNew = state.editingQuestion === 'new';
  const q = qDraft;
  return `
    <div class="modal-overlay" data-action="close-modal-overlay">
      <div class="modal question-modal">
        <div class="modal-header"><h3>${isNew ? 'Add a question' : 'Edit question'}</h3><button class="icon-btn" data-action="close-modal">&times;</button></div>
        <div class="modal-body">
          <label class="field-label">Question code</label>
          <input id="qId" value="${esc(q.id)}" placeholder="e.g. SDC.999" ${isNew ? '' : 'readonly'} />
          <label class="field-label">Category</label>
          <select id="qCategory">
            ${state.categories.map(c => `<option value="${esc(c)}" ${q.category === c ? 'selected' : ''}>${esc(c)}</option>`).join('')}
          </select>
          <label class="field-label">Severity</label>
          <select id="qSeverity">
            ${['IMMEDIATE', 'HIGH', 'MEDIUM', 'LOW'].map(s => `<option value="${s}" ${q.severity === s ? 'selected' : ''}>${s}</option>`).join('')}
          </select>
          <label class="field-label">Question text</label>
          <textarea id="qText" rows="2">${esc(q.text)}</textarea>
          <label class="field-label">Guidance (optional)</label>
          <textarea id="qGuidance" rows="2">${esc(q.guidance || '')}</textarea>
          <label class="field-label">Answer options (comma-separated)${q.children && q.children.length ? ' &mdash; ignored while this question has sub-questions below' : ''}</label>
          <input id="qOptions" value="${esc((q.options || []).join(', '))}" placeholder="Yes, No, Not Observable" />
          <label class="field-label">Links</label>
          ${linksEditorHTML(q.links, 'parent')}
          <label class="field-label">Reference photos</label>
          ${photosEditorHTML(q.photos, 'parent')}

          <label class="field-label" style="margin-top:20px;">Sub-questions</label>
          <p style="color:var(--ink-soft);font-size:.8rem;margin:0 0 10px;">If this question breaks down into individually-answered parts (like SDC.410.a / .b), add them here. Each is answered on its own during an assessment.</p>
          <div id="childrenContainer">
            ${(q.children || []).map((c, i) => childEditorHTML(c, i)).join('') || '<p style="color:var(--ink-soft);font-size:.82rem;">No sub-questions yet.</p>'}
          </div>
          <button type="button" class="btn btn-ghost btn-sm" data-action="add-child">+ Add sub-question</button>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" data-action="save-question">Save question</button>
        </div>
      </div>
    </div>
  `;
}

function locationModalHTML() {
  const isNew = state.editingLocation === 'new';
  const l = isNew ? { name: '' } : state.editingLocation;
  return `
    <div class="modal-overlay" data-action="close-modal-overlay">
      <div class="modal">
        <div class="modal-header"><h3>${isNew ? 'Add location' : 'Edit location'}</h3><button class="icon-btn" data-action="close-modal">&times;</button></div>
        <div class="modal-body">
          <label class="field-label">Location name</label>
          <input id="locName" value="${esc(l.name)}" placeholder="e.g. Main Street" />
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" data-action="close-modal">Cancel</button>
          <button class="btn btn-primary" data-action="save-location" data-id="${l.id || ''}">Save</button>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================================
   MASTER RENDER
========================================================================= */

function render() {
  renderNav();
  const main = document.getElementById('main');
  if (!state.loaded || !state.locationsLoaded) {
    main.innerHTML = `<div class="loading-screen">Loading&hellip;</div>`;
    return;
  }
  if (state.view === 'dashboard') {
    main.innerHTML = (!state.isAdmin && !state.selectedLocationId) ? renderLocationGate() : renderDashboard();
  }
  else if (state.view === 'take') {
    main.innerHTML = (!state.selectedLocationId && !state.draftRun) ? renderLocationGate() : renderTake();
  }
  else if (state.view === 'reports') main.innerHTML = state.isAdmin ? renderReports() : renderDashboard();
  else if (state.view === 'settings') main.innerHTML = state.isAdmin ? renderSettings() : renderDashboard();
  else if (state.view === 'runDetail') main.innerHTML = state.isAdmin ? renderRunDetail() : renderDashboard();
  renderModal();
  if (state.view === 'settings' && state.isAdmin && state.settingsTab === 'templates' && state.editingTemplate && state.templateEditorTab === 'arrange') {
    initArrangeSortables();
  }
}

/* =========================================================================
   EVENT DELEGATION
========================================================================= */

document.addEventListener('input', (e) => {
  const ta = e.target.closest('.notes-textarea');
  if (!ta) return;
  const code = ta.getAttribute('data-code');
  const r = findResponse(code);
  if (r) r.notes = ta.value;
  refreshItemState(code);
});

document.addEventListener('click', async (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
  try {
    await handleClickAction(t, e);
  } catch (err) {
    console.error('Action failed:', err);
    alert('Something went wrong: ' + (err && err.message ? err.message : err));
  }
});

async function handleClickAction(t, e) {
  const action = t.getAttribute('data-action');
  const id = t.getAttribute('data-id');

  if (action === 'select-location') {
    const loc = state.locations.find(x => x.id === id);
    if (!loc) return;
    state.selectedLocationId = loc.id;
    state.selectedLocationName = loc.name;
    saveSelectedLocation(loc.id, loc.name);
    render();
    return;
  }
  if (action === 'change-location') {
    if (state.draftRun && !confirm('You have an assessment in progress. Changing location will not affect it, but you will need to pick a location again for future assessments. Continue?')) return;
    state.selectedLocationId = null;
    state.selectedLocationName = null;
    clearSelectedLocation();
    render();
    return;
  }

  if (action === 'view-photo') { showPhotoLightbox(t.getAttribute('data-url')); return; }
  if (action === 'close-lightbox') {
    state.showingLightbox = false;
    document.getElementById('modalRoot').innerHTML = '';
    return;
  }

  if (action === 'nav') { goToView(t.getAttribute('data-view')); return; }
  if (action === 'logout') { adminLogout(); return; }
  if (action === 'close-modal' || action === 'close-modal-overlay') {
    if (action === 'close-modal-overlay' && e.target !== t) return;
    state.showPasswordModal = false; state.editingQuestion = null; state.editingLocation = null; qDraft = null;
    renderModal();
    return;
  }
  if (action === 'submit-password') {
    document.getElementById('pwError').textContent = '';
    await attemptAdminLogin(document.getElementById('pwInput').value);
    return;
  }

  if (action === 'seed-bank') {
    t.disabled = true; t.textContent = 'Loading&hellip;';
    await seedQuestionBank();
    return;
  }

  if (action === 'add-question') { state.editingQuestion = 'new'; startQuestionEdit('new'); renderModal(); return; }
  if (action === 'edit-question') {
    const q = state.questions.find(x => x.id === id);
    state.editingQuestion = q; startQuestionEdit(q); renderModal(); return;
  }
  if (action === 'delete-question') {
    if (!confirm('Delete this question? It will be removed from any templates using it.')) return;
    await deleteQuestionFromDb(id);
    return;
  }
  if (action === 'add-link') {
    syncQuestionDraftFromDom();
    const scope = t.getAttribute('data-scope');
    const target = scope === 'parent' ? qDraft : qDraft.children[parseInt(scope.replace('child-', ''), 10)];
    target.links = target.links || [];
    target.links.push({ label: '', url: '' });
    renderModal();
    return;
  }
  if (action === 'remove-link') {
    syncQuestionDraftFromDom();
    const scope = t.getAttribute('data-scope');
    const target = scope === 'parent' ? qDraft : qDraft.children[parseInt(scope.replace('child-', ''), 10)];
    target.links.splice(parseInt(t.getAttribute('data-index'), 10), 1);
    renderModal();
    return;
  }
  if (action === 'remove-photo') {
    syncQuestionDraftFromDom();
    const scope = t.getAttribute('data-scope');
    const target = scope === 'parent' ? qDraft : qDraft.children[parseInt(scope.replace('child-', ''), 10)];
    target.photos.splice(parseInt(t.getAttribute('data-index'), 10), 1);
    renderModal();
    return;
  }
  if (action === 'add-photo-path') {
    syncQuestionDraftFromDom();
    const scope = t.getAttribute('data-scope');
    const input = document.querySelector('.photo-path-input[data-scope="' + scope + '"]');
    const value = input ? input.value.trim() : '';
    if (!value) { alert('Enter the filename or path you uploaded to your photos/ folder.'); return; }
    const target = scope === 'parent' ? qDraft : qDraft.children[parseInt(scope.replace('child-', ''), 10)];
    target.photos = target.photos || [];
    target.photos.push({ url: value });
    renderModal();
    return;
  }
  if (action === 'add-child') {
    syncQuestionDraftFromDom();
    qDraft.children.push({ id: '', text: '', guidance: '', options: ['Yes', 'No'], links: [] });
    renderModal();
    return;
  }
  if (action === 'remove-child') {
    syncQuestionDraftFromDom();
    qDraft.children.splice(parseInt(t.getAttribute('data-index'), 10), 1);
    renderModal();
    return;
  }
  if (action === 'save-question') {
    syncQuestionDraftFromDom();
    if (!qDraft.id) { alert('Please enter a question code.'); return; }
    if (!qDraft.category || !qDraft.text.trim()) { alert('Category and question text are required.'); return; }
    if (state.editingQuestion === 'new' && state.questions.some(q => q.id === qDraft.id)) {
      alert('A question with that code already exists. Use a different code or edit the existing one.');
      return;
    }
    const missingChildId = (qDraft.children || []).find(c => !c.id.trim());
    if (missingChildId) { alert('Every sub-question needs a code.'); return; }
    await saveQuestionToDb(qDraft);
    state.editingQuestion = null; qDraft = null; renderModal();
    return;
  }

  if (action === 'new-template') {
    state.editingTemplate = 'new';
    state.templateEditorTab = 'select';
    window.__templateSelection = new Set();
    sectionsDraft = [];
    render();
    return;
  }
  if (action === 'edit-template') {
    const tpl = state.templates.find(x => x.id === id);
    state.editingTemplate = tpl;
    state.templateEditorTab = 'select';
    window.__templateSelection = new Set(tpl.questionIds || []);
    sectionsDraft = tpl.sections ? JSON.parse(JSON.stringify(tpl.sections)) : [];
    render();
    return;
  }
  if (action === 'cancel-template-edit') { state.editingTemplate = null; sectionsDraft = []; render(); return; }
  if (action === 'delete-template') {
    if (!confirm('Delete this template?')) return;
    await deleteTemplateFromDb(id);
    return;
  }
  if (action === 'save-template') {
    const name = document.getElementById('tplName').value.trim();
    if (!name || window.__templateSelection.size === 0) { alert('Give the template a name and select at least one question.'); return; }
    reconcileSections();
    const sections = readSectionsFromDom(); // picks up live DOM order if the Arrange tab is mounted, else falls back to sectionsDraft
    const flatIds = sections.flatMap(s => s.questionIds);
    await saveTemplateToDb({
      id: id || undefined,
      name,
      description: document.getElementById('tplDesc').value.trim(),
      frequency: document.getElementById('tplFrequency').value,
      sections: sections.map(s => ({ id: s.id, name: s.name, questionIds: s.questionIds })),
      questionIds: flatIds
    });
    state.editingTemplate = null; sectionsDraft = []; render();
    return;
  }
  if (action === 'toggle-question-select') {
    if (window.__templateSelection.has(id)) window.__templateSelection.delete(id); else window.__templateSelection.add(id);
    window.__tplFilter();
    return;
  }
  if (action === 'toggle-cat-select') {
    const ids = t.getAttribute('data-ids').split(',');
    const allSelected = ids.every(x => window.__templateSelection.has(x));
    ids.forEach(x => allSelected ? window.__templateSelection.delete(x) : window.__templateSelection.add(x));
    window.__tplFilter();
    return;
  }
  if (action === 'template-editor-tab') {
    if (state.templateEditorTab === 'arrange') sectionsDraft = readSectionsFromDom();
    state.templateEditorTab = t.getAttribute('data-tab');
    render();
    return;
  }
  if (action === 'add-section') {
    sectionsDraft = readSectionsFromDom();
    sectionsDraft.push({ id: uid('sec'), name: '', questionIds: [] });
    render();
    return;
  }
  if (action === 'delete-section') {
    sectionsDraft = readSectionsFromDom();
    const sid = t.getAttribute('data-section-id');
    const idx = sectionsDraft.findIndex(s => s.id === sid);
    if (idx === -1) return;
    const removed = sectionsDraft[idx];
    if (removed.questionIds.length && !confirm('This section has ' + removed.questionIds.length + ' question(s). Delete it and move them to Unassigned?')) return;
    sectionsDraft.splice(idx, 1);
    if (removed.questionIds.length) {
      let unassigned = sectionsDraft.find(s => s.id === '__unassigned__');
      if (!unassigned) { unassigned = { id: '__unassigned__', name: 'Unassigned', questionIds: [] }; sectionsDraft.push(unassigned); }
      unassigned.questionIds.push(...removed.questionIds);
    }
    render();
    return;
  }

  if (action === 'new-location') { state.editingLocation = 'new'; renderModal(); return; }
  if (action === 'edit-location') { state.editingLocation = state.locations.find(x => x.id === id); renderModal(); return; }
  if (action === 'delete-location') {
    if (!confirm('Delete this location?')) return;
    await deleteLocationFromDb(id);
    return;
  }
  if (action === 'save-location') {
    const name = document.getElementById('locName').value.trim();
    if (!name) { alert('Enter a location name.'); return; }
    await saveLocationToDb({ id: id || undefined, name });
    state.editingLocation = null; renderModal();
    return;
  }

  if (action === 'settings-tab') { state.settingsTab = t.getAttribute('data-tab'); state.editingTemplate = null; render(); return; }

  if (action === 'start-run') {
    const tpl = state.templates.find(x => x.id === id);
    if (!tpl) return;
    const responses = [];
    const sectionList = (tpl.sections && tpl.sections.length)
      ? tpl.sections
      : [{ id: 'legacy', name: null, questionIds: tpl.questionIds || [] }];
    sectionList.forEach(section => {
      section.questionIds.forEach(qid => {
        const q = state.questions.find(x => x.id === qid);
        if (!q) return;
        flattenAnswerable(q).forEach(item => {
          responses.push({
            code: item.code, text: item.text, guidance: item.guidance, links: item.links || [], photos: item.photos || [],
            options: item.options, severity: item.severity, category: item.category,
            sectionName: section.name || item.category,
            isChild: item.isChild, parentCode: item.parentCode, parentText: item.parentText,
            parentGuidance: item.parentGuidance || '', parentLinks: item.parentLinks || [], parentPhotos: item.parentPhotos || [],
            answer: null, notes: ''
          });
        });
      });
    });
    state.takeStage = 'filling';
    state.takeValidationAttempted = false;
    state.draftRun = {
      id: uid('run'), templateId: tpl.id, templateName: tpl.name,
      locationId: state.selectedLocationId || '',
      locationName: state.selectedLocationName || '',
      assessorName: '', date: todayISO(), responses, status: 'in-progress', createdAt: new Date().toISOString()
    };
    render();
    return;
  }
  if (action === 'resume-draft') {
    const d = loadLocalDrafts().find(x => x.id === id);
    if (d) { state.draftRun = d; state.takeStage = 'filling'; state.takeValidationAttempted = false; render(); }
    return;
  }
  if (action === 'discard-draft') {
    if (!confirm('Discard this draft?')) return;
    removeLocalDraft(id); render();
    return;
  }
  if (action === 'cancel-draft') { state.draftRun = null; state.takeStage = 'filling'; state.takeValidationAttempted = false; render(); return; }
  if (action === 'answer') {
    const code = t.getAttribute('data-code');
    const opt = t.getAttribute('data-option');
    const r = findResponse(code);
    if (r) r.answer = opt;
    const group = t.closest('.option-group');
    group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    if (isFailOption(opt)) {
      const wrap = document.getElementById('notes-wrap-' + code);
      if (wrap) wrap.style.display = 'block';
    }
    refreshItemState(code);
    return;
  }
  if (action === 'toggle-notes') {
    const code = t.getAttribute('data-code');
    const wrap = document.getElementById('notes-wrap-' + code);
    if (wrap) wrap.style.display = wrap.style.display === 'none' ? 'block' : 'none';
    return;
  }
  if (action === 'save-draft') {
    syncMetaFromDom();
    upsertLocalDraft(state.draftRun);
    alert('Draft saved on this device.');
    return;
  }
  if (action === 'submit-run') {
    syncMetaFromDom();
    const incomplete = state.draftRun.responses.filter(r => !isItemComplete(r));
    if (incomplete.length > 0) {
      state.takeValidationAttempted = true;
      render();
      setTimeout(() => {
        const first = document.querySelector('.missing');
        if (first) first.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    state.takeValidationAttempted = false;
    state.takeStage = 'review';
    render();
    return;
  }
  if (action === 'back-to-filling') { state.takeStage = 'filling'; render(); return; }
  if (action === 'confirm-send-slack') {
    document.querySelectorAll('.review-note-textarea').forEach(ta => {
      const code = ta.getAttribute('data-code');
      const r = findResponse(code);
      if (r) r.notes = ta.value;
    });
    const score = computeScore(state.draftRun.responses);
    const payload = buildSlackPayload(state.draftRun, score);
    runSlackSendSequence(payload, async () => {
      const finished = sanitizeForFirestore({ ...state.draftRun, status: 'completed', score, completedAt: new Date().toISOString() });
      delete finished.id;
      const savedId = state.draftRun.id;
      try {
        await submitRunToDb(finished);
        removeLocalDraft(savedId);
        state.draftRun = null;
        state.takeStage = 'filling';
        if (state.isAdmin) state.view = 'reports';
        render();
      } catch (err) {
        console.error('Submit failed', err);
        alert('Something went wrong submitting this assessment: ' + (err && err.message ? err.message : err) + '\n\nYour answers are safe — click Submit again to retry, or Save draft.');
        render();
      }
    });
    return;
  }

  if (action === 'acknowledge-run') {
    await updateDoc(doc(db, 'runs', id), { acknowledged: true });
    return;
  }
  if (action === 'unacknowledge-run') {
    await updateDoc(doc(db, 'runs', id), { acknowledged: false });
    return;
  }
  if (action === 'open-run') { state.activeRunId = id; state.view = 'runDetail'; render(); return; }
  if (action === 'delete-run') {
    if (!confirm('Delete this assessment report?')) return;
    await deleteRunFromDb(id);
    return;
  }
  if (action === 'export-csv') {
    const rows = [['Date', 'Template', 'Location', 'Assessor', 'Score %', 'Grade', 'Critical Fails', 'Status']];
    (window.__reportsFiltered || state.runs).forEach(r => rows.push([
      r.date, r.templateName, r.locationName, r.assessorName,
      r.status === 'completed' ? r.score.percent : '',
      r.status === 'completed' ? r.score.grade : '',
      r.status === 'completed' ? r.score.criticalFails : '',
      r.status
    ]));
    downloadText('safe-assessments.csv', toCSV(rows), 'text/csv');
    return;
  }
  if (action === 'print') { window.print(); return; }
}

function syncMetaFromDom() {
  const assessor = document.getElementById('metaAssessor');
  const date = document.getElementById('metaDate');
  if (assessor) state.draftRun.assessorName = assessor.value;
  if (date) state.draftRun.date = date.value;
  document.querySelectorAll('.notes-textarea').forEach(ta => {
    const code = ta.getAttribute('data-code');
    const r = findResponse(code);
    if (r) r.notes = ta.value;
  });
}

/* =========================================================================
   MOBILE SIDEBAR TOGGLE
========================================================================= */

document.getElementById('menuBtn').addEventListener('click', () => {
  document.getElementById('sidebar').classList.add('open');
  document.getElementById('sidebarBackdrop').style.display = 'block';
});
document.getElementById('sidebarBackdrop').addEventListener('click', () => {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarBackdrop').style.display = 'none';
});

/* =========================================================================
   BOOT
========================================================================= */

subscribeQuestions();
subscribeTemplates();
subscribeLocations();
(function initLocation() {
  const saved = loadSelectedLocation();
  if (saved) { state.selectedLocationId = saved.id; state.selectedLocationName = saved.name; }
})();
render();
