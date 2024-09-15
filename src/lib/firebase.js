import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD_AduXp2Igcno9ebVpt1PhoIA_i3X8vlk",
  authDomain: "reactchat-b3b3c.firebaseapp.com",
  projectId: "reactchat-b3b3c",
  storageBucket: "reactchat-b3b3c.appspot.com",
  messagingSenderId: "948142825777",
  appId: "1:948142825777:web:629f4bc67e22d5fd7d9010"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
