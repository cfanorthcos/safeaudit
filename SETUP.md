# Setup guide

This app is plain HTML/CSS/JS — no build step, no npm install. It talks
directly to Firebase from the browser and is hosted for free on GitHub
Pages. Follow these steps in order.

## 1. Create the Firebase project

1. Go to https://console.firebase.google.com and click **Add project**.
2. Name it anything (e.g. "safe-self-assessments"). You can disable
   Google Analytics for this project — it's not needed.
3. Once created, you'll land on the project overview page.

## 2. Turn on Firestore (the database)

1. In the left sidebar, click **Build -> Firestore Database**.
2. Click **Create database**.
3. Choose **Start in production mode** (we'll paste in our own rules in
   step 5 — don't use test mode, it's wide open to anyone).
4. Pick a location close to your restaurants and click **Enable**.

## 3. Turn on Authentication (for the admin password)

1. In the left sidebar, click **Build -> Authentication**.
2. Click **Get started**.
3. Under **Sign-in method**, click **Email/Password**, toggle it **on**, and save.
4. Click the **Users** tab -> **Add user**.
   - Email: `admin@opshub.internal` (must match `firebase-config.js` exactly —
     see step 6 if you want to change it)
   - Password: whatever you want your team to type to unlock Reports and
     Settings. This is the *only* password anyone will ever enter.
5. That's your one and only admin account. You don't need to create any
   more users, and there's no "sign up" screen in the app for anyone to
   create additional ones.

## 4. Register a web app to get your config keys

1. Click the gear icon (top left) -> **Project settings**.
2. Scroll to **Your apps** -> click the **</>** (web) icon.
3. Give it a nickname (e.g. "safe-web") and click **Register app**. You
   don't need Firebase Hosting here — you're using GitHub Pages instead.
4. You'll see a `firebaseConfig` object with `apiKey`, `authDomain`, etc.
   Copy those values into `firebase-config.js` in this project, replacing
   every `REPLACE_ME`.

This file is safe to commit to a public GitHub repo — these values
aren't secret. Firestore Security Rules (next step) are what actually
protect your data, not hiding this file.

## 5. Publish the security rules

1. Back in **Firestore Database**, click the **Rules** tab.
2. Delete what's there and paste in the entire contents of
   `firestore.rules` from this project.
3. Click **Publish**.

Without this step, either nobody can read/write anything, or (if you
left it in test mode) everyone can — so don't skip it.

## 5b. Turn on Storage (for reference photos)

Photos attach to questions in Settings -> Question Library — e.g. a
photo showing scoop handles pointing the correct direction. This uses
Firebase Storage so that anyone with the admin password can upload a
photo directly from the question editor — no GitHub access needed.

**This requires Firebase's paid "Blaze" plan** (as of February 2026,
Google no longer allows Cloud Storage on the free plan at all). Blaze
is still pay-as-you-go, not a flat fee, and includes a no-cost quota
before anything is actually billed — for a handful of locations
uploading resized reference photos, this should realistically stay at
$0/month, but it does need a payment method on file.

1. Click the gear icon -> **Usage and billing** -> upgrade to **Blaze**
   (you'll be asked to link a payment method).
2. While you're there, set up a **budget alert**: gear icon -> Usage
   and billing -> Details & settings -> Budgets & alerts -> Create
   budget. Pick your project, set an amount like $1-5, and make sure
   your email is the recipient. This is a notification only — it won't
   stop or pause anything — but it means you'd know immediately if
   usage ever looked different than expected.
3. In the left sidebar, click **Build -> Storage** -> **Get started**
   -> click through the setup prompts (default location is fine,
   ideally the same region you picked for Firestore).
4. Click the **Rules** tab and paste in the entire contents of
   `storage.rules` from this project. Click **Publish**.

That's it. Anyone signed in with the admin password can now add a
photo straight from the question editor — pick a file, it uploads and
resizes automatically (max 1600px on the longest side, so it stays
fast to load without losing the detail you need — e.g. to actually see
scoop-handle orientation clearly).

## 6. (Optional) Use a different admin email

`firebase-config.js` sets `window.ADMIN_EMAIL = "admin@opshub.internal"`.
This is never shown to anyone — it's just the fixed username the app
uses behind the scenes when someone types the shared password. You can
leave it as-is, or change it to anything you like as long as:
- It matches the email you used in step 3, and
- You update `firebase-config.js` to match.

## 7. Put it on GitHub Pages

1. Create a new **public** repository on GitHub (Pages' free tier
   requires public repos unless you're on GitHub Pro/Team/Enterprise).
2. Upload all the files in this project to the repo root:
   `index.html`, `styles.css`, `app.js`, `data-questions.js`,
   `firebase-config.js` (with your real values filled in).
   You don't need to upload `firestore.rules`, `storage.rules`, or this
   `SETUP.md` — they're
   not used by the live site — but there's no harm in keeping them in
   the repo for your own reference.
3. In the repo, go to **Settings -> Pages**.
4. Under **Source**, choose **Deploy from a branch**, branch `main`,
   folder `/ (root)`. Save.
5. GitHub will give you a URL like
   `https://yourusername.github.io/your-repo-name/` — that's your live
   app. It can take a minute or two to go live the first time.

## 8. First run

1. Open your new site.
2. Click **Reports** or **Settings** in the sidebar and enter the
   password you set in step 3.
3. In **Settings -> Question Library**, click **Load starter question
   bank** — this loads the ~315 questions parsed from your Ops Hub Daily
   export (one-time; it won't duplicate if you click it again by
   mistake, since it overwrites by question code rather than appending).
4. In **Settings -> Locations**, add your restaurant locations.
5. In **Settings -> Build Assessment**, create at least one template
   (or select every question for a "Full SAFE Assessment").
6. Head to **Take Assessment** to try it end-to-end.

## New since last update

- **Reference photos on questions**: in the question editor (Settings ->
  Question Library -> edit or add a question, and the same for each
  sub-question), you can now attach photos — e.g. a photo showing scoop
  handles pointing the correct direction. Pick a file and it uploads
  and resizes automatically (max 1600px on the longest side, to stay
  fast without losing detail). They show up right in the assessment
  when someone's taking it, and clicking one opens it full-size. Needs
  Storage turned on — see step 5b above. Anyone with the admin password
  can add a photo this way, same as adding a question or building a
  template — no GitHub access needed.
- **Acknowledging IMMEDIATE failures**: the Dashboard now lists each
  completed assessment with an unreviewed IMMEDIATE (critical) item
  failure, with a "Mark reviewed" button right there. Reviewing one
  removes it from that list. You can also toggle it from the report's
  own page (a "Mark reviewed" / "Undo" button near the score stamp).
  Unreviewed critical failures also show a small "Needs review" tag
  in the Reports table.
- **Arranging question order**: in Settings -> Build Assessment, editing
  a template now has two steps: "1. Choose questions" (unchanged) and
  "2. Arrange order" (new). The Arrange tab groups your selected
  questions into sections you name yourself (it starts by grouping them
  by their original category as a starting point) — drag questions to
  reorder them or move them into a different section, and drag a
  section's grip handle to reorder whole sections. This is the order
  your team sees when taking the assessment, so you can match it to the
  physical walking path through your kitchen. This uses a small
  drag-and-drop library (SortableJS) loaded from a CDN in `index.html`;
  no build step needed.

- **Tighter rules on submitted assessments**: `firestore.rules` now
  checks that anything written to the `runs` collection actually looks
  like a real assessment (right fields, right types, reasonable size)
  before accepting it, instead of accepting any data at all. Re-publish
  the updated `firestore.rules` (Firestore Database -> Rules -> paste
  -> Publish) to pick this up. Similarly, `storage.rules` now caps
  individual photo uploads at 3MB (down from an initial 10MB) — plenty
  of headroom since the app resizes photos before upload anyway, but
  a tighter ceiling against anything unexpected. Neither of these stops
  a determined, targeted script from someone who already has the admin
  password — for that, the next layer would be **Firebase App Check**
  (Build -> App Check in the console), which verifies requests are
  coming from your actual site rather than a bot. Ask if you'd like
  help setting that up.

## Known limitations in this version

- **Slack integration is simulated.** The Review & Submit screen plays a
  "sending to Slack" animation and logs the exact payload it *would*
  send to your browser console (open DevTools → Console to see it) —
  but it doesn't actually call Slack yet, on purpose, so you can try
  the flow first. When you're ready to wire up the real thing:
  1. Create a Slack Incoming Webhook (Slack → your workspace → Apps →
     search "Incoming Webhooks" → add one → pick a channel → copy the
     Webhook URL).
  2. In `app.js`, find `runSlackSendSequence` and replace the
     `console.log('[Slack webhook simulation]...` line with an actual
     `fetch(webhookUrl, { method: 'POST', body: JSON.stringify(payload) })`.
  3. **Security note:** calling a webhook straight from client-side JS
     means the URL is visible to anyone who views your site's source —
     anyone could find it and post fake messages into your channel.
     For a public site, it's worth routing that call through something
     that can keep the URL private, like a small Firebase Cloud
     Function or Zapier webhook. Happy to help set that up when you get
     there.
- **Canceling a photo upload mid-edit**: if you upload a photo while
  editing a question and then hit Cancel instead of Save, that photo
  file stays in Storage even though the question doesn't reference it
  (removing a photo with its own "x" button, or removing a sub-question
  entirely, does clean up properly — it's specifically the "upload,
  then Cancel the whole edit" path that leaves a stray file). These are
  small resized JPEGs, so the storage cost is negligible even if a few
  pile up, but worth knowing about.
- **Drafts are per-device**: an in-progress assessment is saved in the
  browser you're using (so you can close the tab and come back), but it
  won't show up if you open the app on a different phone or computer.
  Only *submitted* assessments sync to Firestore and show up in Reports
  everywhere.

## Costs

Firebase's free "Spark" plan includes 1 GiB stored and 50k reads / 20k
writes per day in Firestore, and unlimited free Email/Password
authentication — that part of this app costs $0 regardless.

Storage (for reference photos) requires the paid "Blaze" plan (see
step 5b) — but Blaze is pay-as-you-go with its own no-cost quota before
billing kicks in, so a handful of locations uploading resized photos
should still realistically land at $0/month. The budget alert set up
in step 5b will tell you right away if that ever changed.
