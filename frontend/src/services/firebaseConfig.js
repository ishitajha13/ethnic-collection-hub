/**
 * ETHNIC COLLECTION HUB - Firebase Configuration & Bridge
 * Connects to Firebase Authentication, Firestore Database and Storage
 * when environment variables are supplied; gracefully bridges to local persistent
 * StoreService when running locally without active Firebase credentials.
 */

export const isFirebaseConfigured = Boolean(
  import.meta.env.VITE_FIREBASE_API_KEY &&
  import.meta.env.VITE_FIREBASE_PROJECT_ID
);

export const firebaseCredentialsHelp = {
  requiredEnvVars: [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ],
  status: isFirebaseConfigured ? 'Connected' : 'Operating in Secure Local Persistence Mode',
  note: 'To connect live Firebase, add your project credentials to a .env file in the frontend folder.'
};
