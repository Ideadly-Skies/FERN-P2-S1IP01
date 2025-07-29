// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCgFwqnDezMbRhyKDnn_Aa0LBX9NbtbRSw",
  authDomain: "fern-p2-s1ipo1.firebaseapp.com",
  projectId: "fern-p2-s1ipo1",
  storageBucket: "fern-p2-s1ipo1.firebasestorage.app",
  messagingSenderId: "138439585872",
  appId: "1:138439585872:web:0a32fb9f6f6592217f6155",
  measurementId: "G-96HF4GH4H5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();