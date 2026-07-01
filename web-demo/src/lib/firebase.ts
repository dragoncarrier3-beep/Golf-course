import { initializeApp, type FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  enableIndexedDbPersistence,
  type Firestore,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'coursegrade-demo.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'coursegrade-demo',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'coursegrade-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:000000000000:web:demo',
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let persistenceEnabled = false;

export function getFirebaseApp(): FirebaseApp {
  if (!app) app = initializeApp(firebaseConfig);
  return app;
}

export function getDb(): Firestore {
  if (!db) {
    db = getFirestore(getFirebaseApp());
    if (!persistenceEnabled) {
      persistenceEnabled = true;
      enableIndexedDbPersistence(db).catch(() => {
        /* multi-tab or unsupported — local backup still active */
      });
    }
  }
  return db;
}

export function isFirebaseConfigured(): boolean {
  return Boolean(import.meta.env.VITE_FIREBASE_API_KEY);
}
