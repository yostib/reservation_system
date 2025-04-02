// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
    getFirestore,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    getDocs  // Add this import
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBVLEv2juwZk7EF0Fyo24Jo6Ft4bJ7gsd8",
    authDomain: "reservation-sys-718bf.firebaseapp.com",
    projectId: "reservation-sys-718bf",
    storageBucket: "reservation-sys-718bf.appspot.com",
    messagingSenderId: "324248991770",
    appId: "1:324248991770:web:b185da94156668297879a3",
    measurementId: "G-EB4971YV43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const db = getFirestore(app);

// Export all Firestore functions you need
export {
    auth,
    db,
    collection,
    addDoc,
    query,
    where,
    onSnapshot,
    getDocs  // Export getDocs
};