import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCExIA_lWdeWB7L8T1m071UkgbBW7OIN_E",
  authDomain: "flex-app-d513b.firebaseapp.com",
  projectId: "flex-app-d513b",
  storageBucket: "flex-app-d513b.firebasestorage.app",
  messagingSenderId: "193582812798",
  appId: "1:193582812798:web:2779fa14a7a27a25dcd22f",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
