import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCNggExOZwetvJpBA5cWTIXpuD-n03KP4k",
  authDomain: "pedacinho-do-ceu-e8dbf.firebaseapp.com",
  projectId: "pedacinho-do-ceu-e8dbf",
  storageBucket: "pedacinho-do-ceu-e8dbf.firebasestorage.app",
  messagingSenderId: "1028219258789",
  appId: "1:1028219258789:web:e79fa835b9b4ab060d0a4c",
  measurementId: "G-SSNMGEY169"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);