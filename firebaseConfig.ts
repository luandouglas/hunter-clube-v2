// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSNIN7e99d6BiJIYDfDoLpgRhgPNMv5lw",
  authDomain: "hunter-clube.firebaseapp.com",
  projectId: "hunter-clube",
  storageBucket: "hunter-clube.appspot.com",
  messagingSenderId: "145608302361",
  appId: "1:145608302361:web:7e7bf560825b60f54caf88",
  measurementId: "G-1PYCSE1070",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
