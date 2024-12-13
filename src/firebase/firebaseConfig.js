import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAjzdBV0Urp0Ffk3Mu1URtEJMrRKAoZq4Y",
  authDomain: "smartlib-e8161.firebaseapp.com",
  databaseURL: "https://smartlib-e8161-default-rtdb.firebaseio.com",
  projectId: "smartlib-e8161",
  storageBucket: "smartlib-e8161.appspot.com",
  messagingSenderId: "602402777674",
  appId: "1:602402777674:web:b45a5014c4bd2b4a2a54b3",
  measurementId: "G-EVQJEBP78L",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const storage = getStorage(app);
export const db = getFirestore(app);
