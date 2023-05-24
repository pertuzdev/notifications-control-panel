import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBJ44vtFkc58Gx9I7Gy_qTJcku-ROg0VaM",
  authDomain: "iglesiaeverapp.firebaseapp.com",
  projectId: "iglesiaeverapp",
  storageBucket: "iglesiaeverapp.appspot.com",
  messagingSenderId: "982589245293",
  appId: "1:982589245293:web:545a8acae09c4ee1fe3c64",
  measurementId: "G-XTS4GP7XK0",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
