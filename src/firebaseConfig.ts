import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Retrieve environment variables
const firebaseConfig = {
  apiKey: (import.meta as any).env.VITE_FIREBASE_API_KEY || '',
  authDomain: (import.meta as any).env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: (import.meta as any).env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: (import.meta as any).env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: (import.meta as any).env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: (import.meta as any).env.VITE_FIREBASE_APP_ID || '',
};

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
    db = getFirestore(app);
    storage = getStorage(app);
    isFirebaseConfigured = true;
    console.log('Firebase successfully initialized.');

    // Validate connection to Firestore as per SKILL guidelines
    const validateConnection = async () => {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if (error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration or internet connection.");
        }
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
