import firebase from "firebase/app";
import "firebase/firestore";



// const firebaseConfig = {
//   apiKey: "AIzaSyBF2WkiMI3BzGDa6ixhNnDIyodRfR0i29Y",
//   authDomain: "nextjs-todo-b8a73.firebaseapp.com",
//   projectId: "nextjs-todo-b8a73",
//   storageBucket: "nextjs-todo-b8a73.appspot.com",
//   messagingSenderId: "1084375636163",
//   appId: "1:1084375636163:web:c0625c0849ad502ba22a76"
// };

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const db = firebase.firestore();
