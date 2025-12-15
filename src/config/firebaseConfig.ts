import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTo4EF8WedwFl-JofUQ-eQfZqv1kIrr4Q",
  authDomain: "twitter-clone-70524.firebaseapp.com",
  projectId: "twitter-clone-70524",
  storageBucket: "twitter-clone-70524.firebasestorage.app",
  messagingSenderId: "734146722356",
  appId: "1:734146722356:web:d79367b1ad8cf25e04a861",
  measurementId: "G-EYDPHFNVZB",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
