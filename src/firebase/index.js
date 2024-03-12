import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBIa1bQD8wyZ2RehHjrRiADYvI2jtZyLJ4",
    authDomain: "library-app-542d0.firebaseapp.com",
    projectId: "library-app-542d0",
    storageBucket: "library-app-542d0.appspot.com",
    messagingSenderId: "435349519823",
    appId: "1:435349519823:web:1994b591fc2d06a2a4a6ba",
    measurementId: "G-RN0HP52HYK"
};


const app = initializeApp(firebaseConfig);

let db = getFirestore(app);
let auth = getAuth(app);
let storage = getStorage(app);

export { db, auth, storage }