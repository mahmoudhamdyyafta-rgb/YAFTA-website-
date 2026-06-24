import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Retrieve environment variables
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || 'AIzaSyD8Om9Q7nPOPP3hMWq7DC9szZmE3qPjwrU',
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || 'gen-lang-client-0982972904.firebaseapp.com',
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || 'gen-lang-client-0982972904',
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || 'gen-lang-client-0982972904.firebasestorage.app',
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || '612962549207',
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || '1:612962549207:web:a57e8b2ae2852717731f92',
};

const databaseId = (import.meta as any).env.VITE_FIREBASE_DATABASE_ID || 'ai-studio-d52c5b23-f7b7-417f-b089-3d8f336fcf6a';

// Check if variables are valid (not default placeholder strings, and not empty)
const isConfigValid = 
  firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key_here' &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== 'your_project_id_here';

let app;
let auth: any = null;
let db: any = null;
let storage: any = null;
let isFirebaseConfigured = false;

if (isConfigValid) {
  try {
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApp();
    }
    auth = getAuth(app);
    if (databaseId) {
      db = getFirestore(app, databaseId);
    } else {
      db = getFirestore(app);
    }
    storage = getStorage(app);
    isFirebaseConfigured = true;
    console.log('Firebase successfully initialized.');

    // Validate connection to Firestore as per SKILL guidelines
    const validateConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        // Silently ignore to prevent console error logs in offline/sandbox environments
      }
    };
    validateConnection();
  } catch (error) {
    console.warn('Firebase initialization failed, utilizing safe mode fallback:', error);
  }
} else {
  console.log('Firebase credentials not detected or using placeholder values. Operating in client-side fallback mode.');
}

export { app, auth, db, storage, isFirebaseConfigured };
