import firebase from "firebase/firebase";

var firebaseConfig = {
  apiKey: "AIzaSyBKsjIn99THmrlpfmXUBRzOxZP86YUwiqE",
  authDomain: "bchat-4c0cb.firebaseapp.com",
  projectId: "bchat-4c0cb",
  storageBucket: "bchat-4c0cb.appspot.com",
  messagingSenderId: "288911581263",
  appId: "1:288911581263:web:2c846af3156f95301a8a3a",
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

export { firebase, auth };
