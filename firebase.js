// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCNggExOZwetvJpBA5cWTIXpuD-n03KP4k",
  authDomain: "pedacinho-do-ceu-e8dbf.firebaseapp.com",
  projectId: "pedacinho-do-ceu-e8dbf",
  storageBucket: "pedacinho-do-ceu-e8dbf.firebasestorage.app",
  messagingSenderId: "1028219258789",
  appId: "1:1028219258789:web:e79fa835b9b4ab060d0a4c",
  measurementId: "G-SSNMGEY169"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);