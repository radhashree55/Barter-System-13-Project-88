import * as firebase from "firebase";
require("@firebase/firestore");

var firebaseConfig = {
  apiKey: "AIzaSyBj9A5SeoL0dBnzVUMi8zjSfN8hhquFXe0",
  authDomain: "barter-system-app-88d67.firebaseapp.com",
  projectId: "barter-system-app-88d67",
  storageBucket: "barter-system-app-88d67.appspot.com",
  messagingSenderId: "230521953451",
  appId: "1:230521953451:web:f2181fab404b5145e12bee",
  measurementId: "G-5ZVGVBQ63R",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
//firebase.analytics();

export default firebase.firestore();
