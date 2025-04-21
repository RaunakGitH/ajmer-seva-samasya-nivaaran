
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, PhoneAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getMessaging } from 'firebase/messaging';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  // Add your Firebase configuration here
  apiKey: "YOUR_API_KEY",
  authDomain: "samasya-seva.firebaseapp.com",
  projectId: "samasya-seva",
  storageBucket: "samasya-seva.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const messaging = getMessaging(app);

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
