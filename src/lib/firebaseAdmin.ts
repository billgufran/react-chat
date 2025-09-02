import { getApps, initializeApp, applicationDefault, cert, type App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
// Private key may contain escaped newlines; replace with actual newlines
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

let app: App;

if (!getApps().length) {
  if (projectId && clientEmail && privateKey) {
    app = initializeApp({
      credential: cert({ projectId, clientEmail, privateKey }),
    });
  } else {
    // Falls back to ADC if available (e.g., emulator or GCP env). Otherwise init with default.
    app = initializeApp({
      credential: applicationDefault(),
    });
  }
} else {
  app = getApps()[0]!;
}

export const adminAuth = getAuth(app);

