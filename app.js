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
  selectedLocationName: null
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
  // returns array of {code, text, guidance, pathwayLink, options, severity, category, isChild, parentCode, parentText}
  const out = [];
  if (question.children && question.children.length) {
    question.children.forEach(c => {
      out.push({
        code: c.id, text: c.text, guidance: c.guidance, pathwayLink: c.pathwayLink,
        options: c.options || [], severity: question.severity, category: question.category,
        isChild: true, parentCode: question.id, parentText: question.text,
        parentGuidance: question.guidance, parentPathwayLink: question.pathwayLink, parentPathwayUrl: question.pathwayUrl
      });
    });
  } else {
    out.push({
      code: question.id, text: question.text, guidance: question.guidance, pathwayLink: question.pathwayLink,
      options: question.options || [], severity: question.severity, category: question.category,
      isChild: false, parentCode: null, parentText: null
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
  }, err => console.error('locations listener error', err));
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
  await setDoc(doc(db, 'questions', q.id), q);
}
async function deleteQuestionFromDb(id) {
  await deleteDoc(doc(db, 'questions', id));
  // also strip from any templates referencing it
  const updates = state.templates.filter(t => (t.questionIds || []).includes(id));
  for (const t of updates) {
    await updateDoc(doc(db, 'templates', t.id), { questionIds: t.questionIds.filter(x => x !== id) });
  }
}
async function saveTemplateToDb(t) {
  if (t.id) {
    const { id, ...rest } = t;
    await setDoc(doc(db, 'templates', id), rest, { merge: true });
  } else {
    await addDoc(collection(db, 'templates'), { name: t.name, description: t.description, questionIds: t.questionIds, createdAt: new Date().toISOString() });
  }
}
async function deleteTemplateFromDb(id) { await deleteDoc(doc(db, 'templates', id)); }

async function saveLocationToDb(loc) {
  if (loc.id) {
    const { id, ...rest } = loc;
    await setDoc(doc(db, 'locations', id), rest, { merge: true });
  } else {
    await addDoc(collection(db, 'locations'), { name: loc.name, createdAt: new Date().toISOString() });
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
function pathwayHTML(pathwayLink, pathwayUrl) {
  if (pathwayUrl) return `<a class="q-pathway" href="${esc(pathwayUrl)}" target="_blank" rel="noopener">Pathway Link</a>`;
  if (pathwayLink) return `<span class="q-pathway" title="No link saved yet — add one by editing this question in Settings">Pathway Link</span>`;
  return '';
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
  const criticalFailCount = completed.filter(r => r.score.criticalFails > 0).length;
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
        ${criticalFailCount > 0 ? `<div class="callout callout-danger">${criticalFailCount} completed assessment${criticalFailCount > 1 ? 's have' : ' has'} an IMMEDIATE item failure. Review in Reports.</div>` : ''}
      </section>
    </div>
  `;
}

/* =========================================================================
   TAKE ASSESSMENT
========================================================================= */

function renderTake() {
  if (state.draftRun) return renderTakeInProgress();

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
            <div class="template-meta">${(t.questionIds || []).length} questions</div>
          </div>
        `).join('')}
      </div>
    `}
  `;
}

function renderTakeInProgress() {
  const run = state.draftRun;
  const answered = run.responses.filter(r => r.options.length === 0 || r.answer != null).length;
  const total = run.responses.length;
  const pct = total ? Math.round((answered / total) * 100) : 0;

  const byCategory = {};
  run.responses.forEach(r => { (byCategory[r.category] = byCategory[r.category] || []).push(r); });

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
    <div class="progress-label" id="progressLabel">${answered} of ${total} answered</div>

    ${Object.keys(byCategory).map(cat => `
      <section class="panel">
        <h3>${esc(cat)}</h3>
        ${groupByParent(byCategory[cat]).map(g => renderTakeGroup(g)).join('')}
      </section>
    `).join('')}

    <div class="sticky-footer">
      <button class="btn btn-ghost" data-action="save-draft">Save draft</button>
      <button class="btn btn-primary" id="submitBtn" ${answered === total && total > 0 ? '' : 'disabled'} data-action="submit-run">Submit assessment</button>
    </div>
    <div class="hint">Answer every item to submit &mdash; you can save a draft any time.</div>
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
        parentGuidance: it.parentGuidance, parentPathwayLink: it.parentPathwayLink, parentPathwayUrl: it.parentPathwayUrl,
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
  return `
    <details class="q-card sev-${first.severity}">
      <summary class="q-card-head">
        <div class="q-card-main">
          <div class="q-card-badge-row">${badgeHTML(first.severity)} <span class="q-code">${esc(isGroup ? g.parentCode : first.code)}</span></div>
          <div class="q-text">${esc(isGroup ? g.parentText : first.text)} ${pathwayHTML(isGroup ? g.parentPathwayLink : first.pathwayLink, isGroup ? g.parentPathwayUrl : first.pathwayUrl)}</div>
          ${isGroup && g.parentGuidance ? `<div class="q-guidance">${esc(g.parentGuidance)}</div>` : ''}
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
  return `
    <div class="child-item" data-code="${esc(it.code)}">
      ${it.isChild ? `<div class="q-text">${esc(it.text)} ${pathwayHTML(it.pathwayLink, it.pathwayUrl)}</div>` : ''}
      ${it.guidance ? `<div class="q-guidance">${esc(it.guidance)}</div>` : ''}
      ${hasOptions ? `
        <div class="option-group" data-code="${esc(it.code)}">
          ${it.options.map(opt => {
            const cls = isPassOption(opt) ? 'opt-pass' : isFailOption(opt) ? 'opt-fail' : 'opt-neutral';
            const active = it.answer === opt ? ' active' : '';
            return `<button type="button" class="opt-btn ${cls}${active}" data-action="answer" data-code="${esc(it.code)}" data-option="${esc(opt)}">${esc(opt)}</button>`;
          }).join('')}
        </div>
      ` : `<div class="hint">No pass/fail options for this item &mdash; use notes to record what you observed.</div>`}
      <button type="button" class="notes-toggle" data-action="toggle-notes" data-code="${esc(it.code)}">+ Add notes</button>
      <div class="notes-input" id="notes-wrap-${esc(it.code)}" style="display:${it.notes ? 'block' : 'none'}">
        <textarea rows="2" placeholder="Observations or corrective action&hellip;" data-code="${esc(it.code)}" class="notes-textarea">${esc(it.notes || '')}</textarea>
      </div>
    </div>
  `;
}

function findResponse(code) {
  return state.draftRun.responses.find(r => r.code === code);
}

function updateProgressUI() {
  const run = state.draftRun;
  const answered = run.responses.filter(r => r.options.length === 0 || r.answer != null).length;
  const total = run.responses.length;
  const pct = total ? Math.round((answered / total) * 100) : 0;
  const fill = document.getElementById('progressFill');
  const label = document.getElementById('progressLabel');
  const submitBtn = document.getElementById('submitBtn');
  if (fill) fill.style.width = pct + '%';
  if (label) label.textContent = answered + ' of ' + total + ' answered';
  if (submitBtn) submitBtn.disabled = !(answered === total && total > 0);
}

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
            <div class="template-meta">${(t.questionIds || []).length} questions</div>
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

function renderTemplateEditor() {
  const t = state.editingTemplate === 'new' ? { name: '', description: '', questionIds: [] } : state.editingTemplate;
  window.__templateSelection = new Set(t.questionIds || []);

  return `
    <div class="panel">
      <label class="field-label">Template name</label>
      <input id="tplName" value="${esc(t.name)}" placeholder="e.g. Full SAFE Assessment" />
      <label class="field-label">Description</label>
      <textarea id="tplDesc" rows="2" placeholder="When and why this gets used.">${esc(t.description || '')}</textarea>
    </div>
    <div class="filter-bar">
      <div class="search-box"><input id="tplSearch" placeholder="Search questions&hellip;" oninput="window.__tplFilter()" /></div>
      <select id="tplCatFilter" onchange="window.__tplFilter()">
        <option value="all">All categories</option>
        ${state.categories.map(c => `<option value="${esc(c)}">${esc(c)}</option>`).join('')}
      </select>
      <div class="pill-outline" id="tplSelCount">${window.__templateSelection.size} selected</div>
    </div>
    <div id="tplListContainer">${buildTemplateSelectHTML('', 'all')}</div>
    <div class="sticky-footer">
      <button class="btn btn-ghost" data-action="cancel-template-edit">Cancel</button>
      <button class="btn btn-primary" data-action="save-template" data-id="${t.id || ''}">Save template</button>
    </div>
  `;
}

function buildTemplateSelectHTML(search, catFilter) {
  const s = (search || '').toLowerCase();
  const filtered = state.questions.filter(q => {
    if (catFilter !== 'all' && q.category !== catFilter) return false;
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
  document.getElementById('tplListContainer').innerHTML = buildTemplateSelectHTML(search, cat);
  document.getElementById('tplSelCount').textContent = window.__templateSelection.size + ' selected';
};

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
              <td>${r.status === 'completed' ? `<span class="grade-pill" style="color:${gradeColorVar(r.score.grade)};border-color:${gradeColorVar(r.score.grade)}">${esc(r.score.grade)} &middot; ${r.score.percent}%</span>` : '\u2014'}</td>
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
  run.responses.forEach(r => (byCategory[r.category] = byCategory[r.category] || []).push(r));

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

function questionModalHTML() {
  const isNew = state.editingQuestion === 'new';
  const q = isNew ? { id: '', category: state.categories[0] || '', severity: 'MEDIUM', text: '', guidance: '', pathwayLink: false, pathwayUrl: '', options: ['Yes', 'No'] } : state.editingQuestion;
  return `
    <div class="modal-overlay" data-action="close-modal-overlay">
      <div class="modal">
        <div class="modal-header"><h3>${isNew ? 'Add a question' : 'Edit question'}</h3><button class="icon-btn" data-action="close-modal">&times;</button></div>
        <div class="modal-body">
          ${isNew ? `<label class="field-label">Question code</label><input id="qId" placeholder="e.g. SDC.999" />` : `<input type="hidden" id="qId" value="${esc(q.id)}" />`}
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
          <label class="field-label">Answer options (comma-separated)</label>
          <input id="qOptions" value="${esc((q.options || []).join(', '))}" placeholder="Yes, No, Not Observable" />
          <label class="field-label">Pathway link URL (optional)</label>
          <input id="qPathwayUrl" value="${esc(q.pathwayUrl || '')}" placeholder="https://&hellip;" />
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
}

/* =========================================================================
   EVENT DELEGATION
========================================================================= */

document.addEventListener('click', async (e) => {
  const t = e.target.closest('[data-action]');
  if (!t) return;
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

  if (action === 'nav') { goToView(t.getAttribute('data-view')); return; }
  if (action === 'logout') { adminLogout(); return; }
  if (action === 'close-modal' || action === 'close-modal-overlay') {
    if (action === 'close-modal-overlay' && e.target !== t) return;
    state.showPasswordModal = false; state.editingQuestion = null; state.editingLocation = null;
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

  if (action === 'add-question') { state.editingQuestion = 'new'; renderModal(); return; }
  if (action === 'edit-question') {
    const q = state.questions.find(x => x.id === id);
    state.editingQuestion = q; renderModal(); return;
  }
  if (action === 'delete-question') {
    if (!confirm('Delete this question? It will be removed from any templates using it.')) return;
    await deleteQuestionFromDb(id);
    return;
  }
  if (action === 'save-question') {
    const qId = document.getElementById('qId').value.trim();
    if (!qId) { alert('Please enter a question code.'); return; }
    if (state.editingQuestion === 'new' && state.questions.some(q => q.id === qId)) {
      alert('A question with that code already exists. Use a different code or edit the existing one.');
      return;
    }
    const options = document.getElementById('qOptions').value.split(',').map(s => s.trim()).filter(Boolean);
    const q = {
      id: qId,
      category: document.getElementById('qCategory').value,
      severity: document.getElementById('qSeverity').value,
      text: document.getElementById('qText').value.trim(),
      guidance: document.getElementById('qGuidance').value.trim(),
      pathwayLink: true,
      pathwayUrl: document.getElementById('qPathwayUrl').value.trim(),
      options
    };
    await saveQuestionToDb(q);
    state.editingQuestion = null; renderModal();
    return;
  }

  if (action === 'new-template') { state.editingTemplate = 'new'; render(); return; }
  if (action === 'edit-template') { state.editingTemplate = state.templates.find(x => x.id === id); render(); return; }
  if (action === 'cancel-template-edit') { state.editingTemplate = null; render(); return; }
  if (action === 'delete-template') {
    if (!confirm('Delete this template?')) return;
    await deleteTemplateFromDb(id);
    return;
  }
  if (action === 'save-template') {
    const name = document.getElementById('tplName').value.trim();
    if (!name || window.__templateSelection.size === 0) { alert('Give the template a name and select at least one question.'); return; }
    await saveTemplateToDb({
      id: id || undefined,
      name,
      description: document.getElementById('tplDesc').value.trim(),
      questionIds: Array.from(window.__templateSelection)
    });
    state.editingTemplate = null; render();
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
    tpl.questionIds.forEach(qid => {
      const q = state.questions.find(x => x.id === qid);
      if (!q) return;
      flattenAnswerable(q).forEach(item => {
        responses.push({
          code: item.code, text: item.text, guidance: item.guidance, pathwayLink: item.pathwayLink,
          pathwayUrl: item.isChild ? undefined : q.pathwayUrl, options: item.options, severity: item.severity, category: item.category,
          isChild: item.isChild, parentCode: item.parentCode, parentText: item.parentText,
          parentGuidance: item.parentGuidance, parentPathwayLink: item.parentPathwayLink, parentPathwayUrl: item.parentPathwayUrl,
          answer: null, notes: ''
        });
      });
    });
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
    if (d) { state.draftRun = d; render(); }
    return;
  }
  if (action === 'discard-draft') {
    if (!confirm('Discard this draft?')) return;
    removeLocalDraft(id); render();
    return;
  }
  if (action === 'cancel-draft') { state.draftRun = null; render(); return; }
  if (action === 'answer') {
    const code = t.getAttribute('data-code');
    const opt = t.getAttribute('data-option');
    const r = findResponse(code);
    if (r) r.answer = opt;
    const group = t.closest('.option-group');
    group.querySelectorAll('.opt-btn').forEach(b => b.classList.remove('active'));
    t.classList.add('active');
    updateProgressUI();
    return;
  }
  if (action === 'toggle-notes') {
    const code = t.getAttribute('data-code');
    const wrap = document.getElementById('notes-wrap-' + CSS.escape(code));
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
    const score = computeScore(state.draftRun.responses);
    const finished = { ...state.draftRun, status: 'completed', score, completedAt: new Date().toISOString() };
    delete finished.id;
    const savedId = state.draftRun.id;
    await submitRunToDb(finished);
    removeLocalDraft(savedId);
    state.draftRun = null;
    alert('Assessment submitted.');
    if (state.isAdmin) { state.view = 'reports'; }
    render();
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
});

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
