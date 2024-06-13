// src/firebase.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

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
firebase.initializeApp(firebaseConfig);

// Export auth and db
const auth = firebase.auth();
const db = firebase.firestore();

export { auth, db };