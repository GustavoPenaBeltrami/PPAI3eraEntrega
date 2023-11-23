// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore/lite';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCqObZeqQDGw8pKYo2i33N1bcJxJ8cWD_E",
  authDomain: "tpai-grupo10.firebaseapp.com",
  projectId: "tpai-grupo10",
  storageBucket: "tpai-grupo10.appspot.com",
  messagingSenderId: "647551116936",
  appId: "1:647551116936:web:af80a07b35329ebf5d613d",
  measurementId: "G-CWBTTCG28P"
};

// Initialize Firebase
const FirebaseApp = initializeApp(firebaseConfig);

//Base de datos
export const FirebaseDB = getFirestore( FirebaseApp );