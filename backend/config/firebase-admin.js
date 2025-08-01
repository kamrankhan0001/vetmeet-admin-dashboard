// backend/config/firebase-admin.js
const admin = require('firebase-admin');
const path = require('path'); // Ensure path module is imported

// Checking if Firebase Admin SDK has already been initialized
if (!admin.apps.length) {
  try {
    if (process.env.NODE_ENV === 'production') {
      // Use application default credentials in production (e.g., Google Cloud environments)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log("Firebase Admin SDK initialized using application default credentials.");
    } else {
      // Use service account key file for local development
      const serviceAccountPath = path.resolve(__dirname, process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH);
      const serviceAccount = require(serviceAccountPath); // Dynamically load the JSON file

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      console.log("Firebase Admin SDK initialized using service account key.");
    }
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error.message);
    process.exit(1); // Exit with a non-zero code indicating an error
  }
}

// Export Firebase Admin services that will be used across the backend
const auth = admin.auth();

// If you are NOT using Firestore for your primary application data (e.g., using MongoDB instead),
// you can comment out or remove the Firestore initialization below to avoid confusion.
const db = admin.firestore(); // Example if you also use Firestore
module.exports = { admin, auth, db}; // Export only admin and auth if not using Firestore for app data