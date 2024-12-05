import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    GoogleAuthProvider, 
    signInWithPopup, 
    sendEmailVerification, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut,
    updateEmail,
    updatePassword,
    EmailAuthProvider,
    reauthenticateWithCredential,
    onAuthStateChanged,
    deleteUser
} 
    from "https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDocs, updateDoc, serverTimestamp,deleteDoc } from "https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js";


const firebaseConfig = {
    apiKey: "AIzaSyD3l5_2MgQ7u3YJFQA7JVXci1UeHR9atiY",
    authDomain: "form-9cefe.firebaseapp.com",
    projectId: "form-9cefe",
    storageBucket: "form-9cefe.appspot.com",
    messagingSenderId: "981020132262",
    appId: "1:981020132262:web:86313297de43561d0cc567",
    measurementId: "G-E24TJ0NBVV"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

export{ auth, createUserWithEmailAndPassword, GoogleAuthProvider, provider, signInWithPopup, sendEmailVerification, signInWithEmailAndPassword, sendPasswordResetEmail, signOut, getFirestore, db, collection, addDoc, doc, setDoc, getDocs, updateDoc, serverTimestamp, deleteDoc, deleteDoc,  updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged, deleteUser }
