import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Use NEXT_PUBLIC_ env vars so they are available on the client
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'react-chat-fbg.firebaseapp.com',
  databaseURL: 'https://react-chat-fbg.firebaseio.com',
  projectId: 'react-chat-fbg',
  storageBucket: 'react-chat-fbg.firebasestorage.app',
  messagingSenderId: '476271889747',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: 'G-7B1EYKXB0K',
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();
export const firebaseSignInWithPopup = () => signInWithPopup(auth, googleProvider);
export const firebaseSignOut = () => signOut(auth);

