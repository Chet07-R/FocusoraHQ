// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported as analyticsSupported } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBr7JFtqENeGPWA9nQNQSXaOm4HBYjREMA",
  authDomain: "focusorahq-ctv.firebaseapp.com",
  projectId: "focusorahq-ctv",
  storageBucket: "focusorahq-ctv.firebasestorage.app",
  messagingSenderId: "1020259736362",
  appId: "1:1020259736362:web:90452be5da75c9135e9c53",
  measurementId: "G-MX4QB9K7C3"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Analytics only when supported (avoids SSR/build issues)
analyticsSupported()
  .then((supported) => {
    if (supported) {
      getAnalytics(app);
    }
  })
  .catch(() => {
    /* no-op */
  });

// Auth exports
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Firestore export
export const db = getFirestore(app);

export default app;