import firebase from "firebase/app";
import 'firebase/app'
import "firebase/firestore";
import 'firebase/auth'

console.log(process.env.NEXT_PUBLIC_FIREBASE_API_KEY);

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    // apiKey: "AIzaSyBF2WkiMI3BzGDa6ixhNnDIyodRfR0i29Y",
    // authDomain: "nextjs-todo-b8a73.firebaseapp.com",
    // databaseURL:'https://nextjs-todo-b8a73.firebaseio.com',
    // projectId: "nextjs-todo-b8a73",
    // storageBucket: "nextjs-todo-b8a73.appspot.com",
    // messagingSenderId: "1084375636163",
    // appId: "1:1084375636163:web:c0625c0849ad502ba22a76"
};


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
export const auth = firebase.auth();
