// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// ✅ Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCvsr8Btuhra7VCQUI4mK74FbzFOu1X9n8",
  authDomain: "autostudy-304a1.firebaseapp.com",
  projectId: "autostudy-304a1",
  storageBucket: "autostudy-304a1.appspot.com",  // ✅ fixed here
  messagingSenderId: "114509337463",
  appId: "1:114509337463:web:3e920237c96877a7234772",
  measurementId: "G-VQXB3RYF3J"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth & Firestore
export const auth = getAuth(app);
export const db = getFirestore(app);
