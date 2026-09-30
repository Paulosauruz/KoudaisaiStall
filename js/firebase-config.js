// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-analytics.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.19.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBFJbajhfPY3Mz5Sobj1RvTNIOT-7qa4xo",
    authDomain: "gsep-spot.firebaseapp.com",
    projectId: "gsep-spot",
    storageBucket: "gsep-spot.firebasestorage.app",
    messagingSenderId: "178239301386",
    appId: "1:178239301386:web:13f4015b1b1029537c3cf3",
    measurementId: "G-CVLZDNJH0B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);