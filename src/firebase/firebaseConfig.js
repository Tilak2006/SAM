// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe18D5UMs6zMJn7aSxpNc9jjqQYDtTihc",
  authDomain: "sem3project-2885a.firebaseapp.com",
  projectId: "sem3project-2885a",
  storageBucket: "sem3project-2885a.firebasestorage.app",
  messagingSenderId: "282126581566",
  appId: "1:282126581566:web:5c4322890f90153ce6b66f",
  measurementId: "G-M1DB33R9B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase services
export const auth = getAuth(app);       // for authentication
export const db = getFirestore(app);    // for Firestore database
export default app;
