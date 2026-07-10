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
   You don't need to upload `firestore.rules` or this `SETUP.md` — they're
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
- **Attachments**: the source tool supports photo attachments per
  question; this version supports notes but not photo uploads yet
  (would use Firebase Storage — a quick addition if you want it).
- **Drafts are per-device**: an in-progress assessment is saved in the
  browser you're using (so you can close the tab and come back), but it
  won't show up if you open the app on a different phone or computer.
  Only *submitted* assessments sync to Firestore and show up in Reports
  everywhere.

## Costs

Firebase's free "Spark" plan includes 1 GiB stored and 50k reads / 20k
writes per day in Firestore, and unlimited free Email/Password
authentication. A handful of restaurant locations running daily
self-assessments is nowhere near those limits — this should cost $0.
