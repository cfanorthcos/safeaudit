// ---------------------------------------------------------------------
// Firebase config
// ---------------------------------------------------------------------
// Fill this in with the values from:
// Firebase Console -> Project settings (gear icon) -> General -> Your apps
// -> Web app -> SDK setup and configuration -> "Config"
//
// This is safe to commit to a public GitHub repo. Firebase web config
// values are not secret keys — access to your data is controlled by
// Firestore Security Rules (see firestore.rules), not by hiding this file.
// See SETUP.md for the full walkthrough.
// ---------------------------------------------------------------------

window.FIREBASE_CONFIG = {
  apiKey: "AIzaSyDcRrQh1XGB7Q_4pXGNjHhKZAgFtgWQluY",
  authDomain: "safe-a-404be.firebaseapp.com",
  projectId: "safe-a-404be",
  storageBucket: "safe-a-404be.firebasestorage.app",
  messagingSenderId: "500709736713",
  appId: "1:500709736713:web:54368eb1231d8b5db313d8"
};

// This is the fixed email address used for the single admin login.
// When you create your one admin user in Firebase Console -> Authentication,
// use this exact email address (the password field in the app is the
// only thing your team will ever type — this email just lives behind the
// scenes so Firebase Auth has something to authenticate against).
window.ADMIN_EMAIL = "admin@opshub.internal";

// ---------------------------------------------------------------------
// Zapier webhook (for the Slack notification on assessment submission)
// ---------------------------------------------------------------------
// UNLIKE the Firebase values above, this URL is NOT safe in the same
// way — anyone who views your site's source can see it and could POST
// to it directly, triggering fake Slack messages or burning through
// your Zapier task quota. It's a low-stakes exposure (worst case is
// spam messages in one Slack channel, not access to your data), but
// it's real. See SETUP.md for how to create this in Zapier.
window.ZAPIER_WEBHOOK_URL = "https://hooks.zapier.com/hooks/catch/10599539/4ugb54p/";

// All submission data (SAFE audit summary, plus maintenance/supply
// flags as separate fields) goes to this one webhook. Since you're on
// a Zapier plan with Paths, branch there instead of using separate
// webhook URLs — e.g. a path that only continues if
// `maintenanceCount > 0`, another for `supplyCount > 0`, so each can
// route to a different destination from the same Zap. See SETUP.md.
