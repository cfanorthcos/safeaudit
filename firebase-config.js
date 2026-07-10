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
