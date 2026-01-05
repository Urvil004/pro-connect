// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJBe4wSMBuQloAh_KvJaP40tkAN6ojyPc",
  authDomain: "link-to-grow.firebaseapp.com",
  projectId: "link-to-grow",
  storageBucket:"link-to-grow.firebasestorage.app",
  messagingSenderId: "333997447224",
  appId: "1:333997447224:web:020165f2034752f923eecd",
  measurementId: "G-WM2E73GCEZ",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: "select_account",
});

export default app;
