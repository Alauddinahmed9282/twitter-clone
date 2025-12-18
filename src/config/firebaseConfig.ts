import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
  getAuth,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

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

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

export const db = getFirestore(app);
