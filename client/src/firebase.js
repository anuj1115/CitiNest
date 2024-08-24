// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "real-estate-29c51.firebaseapp.com",
  projectId: "real-estate-29c51",
  storageBucket: "real-estate-29c51.appspot.com",
  messagingSenderId: "870394372195",
  appId: "1:870394372195:web:97ee272b720830269f5856"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);