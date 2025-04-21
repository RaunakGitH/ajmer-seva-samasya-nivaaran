
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging, isSupported } from 'firebase/messaging';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "firebase-api-key-placeholder",
  authDomain: "samasya-seva.firebaseapp.com",
  projectId: "samasya-seva",
  storageBucket: "samasya-seva.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "messaging-sender-id-placeholder",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "app-id-placeholder",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "measurement-id-placeholder"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Firebase Cloud Messaging with fallback
const initializeMessaging = async () => {
  try {
    if (await isSupported()) {
      return getMessaging(app);
    }
    return null;
  } catch (error) {
    console.error("Error initializing Firebase messaging:", error);
    return null;
  }
};

// Initialize messaging asynchronously but export a placeholder
let messaging: any = null;
initializeMessaging().then(result => {
  messaging = result;
});

// Authentication providers
const googleProvider = new GoogleAuthProvider();
const phoneProvider = new PhoneAuthProvider(auth);

export { 
  auth, 
  db, 
  storage, 
  messaging, 
  googleProvider, 
  phoneProvider 
};
