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

## 5b. Reference photos (free, no billing needed)

Photos attach to questions in Settings -> Question Library — e.g. a
photo showing scoop handles pointing the correct direction. Rather than
using Firebase Storage (which now requires a paid Blaze plan — see the
optional note at the end of this section), photos are hosted for free
right alongside the rest of the app on GitHub Pages:

1. In your GitHub repo, create a folder named `photos` (Add file ->
   Create new file, type `photos/.gitkeep` as the name to create the
   folder, or just drag image files in and GitHub will offer to create
   the folder for you).
2. Upload your image files into that folder the same way you upload
   everything else (Add file -> Upload files). Keep filenames simple —
   lowercase, no spaces, e.g. `scoop-handles.jpg`.
3. In the app, when editing a question in Settings -> Question Library,
   find **Reference photos** and type the path you just uploaded to
   (e.g. `photos/scoop-handles.jpg`), then click **Add photo**.

That's it — no Firebase Storage, no billing, no quotas. The only
manual step is uploading the file to GitHub yourself before referencing
it in the app, rather than uploading directly from the question editor.

*Optional, for later:* if you'd rather upload photos directly from
inside the app (skipping the GitHub upload step), that's possible using
Firebase Storage, but it requires upgrading to the paid "Blaze" plan
(free-tier-eligible, but a card is required — see our earlier
conversation about costs). Ask if you'd like that version restored;
it's a quick change to bring back.

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
   `firebase-config.js` (with your real values filled in), plus a
   `photos/` folder with any reference photos you want to use (see
   step 5b — this can be added any time, not just now).
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
  handles pointing the correct direction. They're hosted for free
  alongside the rest of the app on GitHub Pages (see step 5b) rather
  than through paid Firebase Storage — upload the image to a `photos/`
  folder in your repo, then paste its filename into the question
  editor. They show up right in the assessment when someone's taking
  it, and clicking one opens it full-size.
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
  -> Publish) to pick this up. This raises the bar against random junk
  being written to your database, but it doesn't stop a determined,
  targeted script — for that, the next layer would be **Firebase App
  Check** (Build -> App Check in the console), which verifies requests
  are coming from your actual site rather than a bot, without requiring
  anyone to log in. Ask if you'd like help setting that up.

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
- **Photos aren't resized automatically.** Since photos are just files
  in your GitHub repo rather than uploaded through the app, there's no
  automatic compression step — a huge phone photo will load slowly on
  a spotty kitchen wifi connection. Worth resizing images yourself
  before uploading (aim for under ~500KB, maybe 1200-1600px on the
  longest side — plenty of detail for something like scoop-handle
  orientation) using your phone's share/edit tools or any free online
  image resizer.
- **Drafts are per-device**: an in-progress assessment is saved in the
  browser you're using (so you can close the tab and come back), but it
  won't show up if you open the app on a different phone or computer.
  Only *submitted* assessments sync to Firestore and show up in Reports
  everywhere.

## Costs

Firebase's free "Spark" plan includes 1 GiB stored and 50k reads / 20k
writes per day in Firestore, and unlimited free Email/Password
authentication — this app (including reference photos, since those are
hosted on GitHub Pages rather than Firebase) costs $0 to run as
described in this guide.
