import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


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
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };