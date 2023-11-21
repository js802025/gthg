// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { getTurtles, registerUser } from "./database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvz8Sp_ESSh55ad8WeBt6CNJmmVXMEEiE",
  authDomain: "gthg-8b42f.firebaseapp.com",
  databaseURL: "https://gthg-8b42f-default-rtdb.firebaseio.com",
  projectId: "gthg-8b42f",
  storageBucket: "gthg-8b42f.appspot.com",
  messagingSenderId: "859211708021",
  appId: "1:859211708021:web:10bfb2efe47b642e716a3c",
  measurementId: "G-B9CT2X5EY6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();

function join() {
    if (getAuth().currentUser) {
        registerUser(getAuth().currentUser);
    } else {
        signInWithPopup(auth, new GoogleAuthProvider()).then((result) => {
            getTurtles().then((turtles) => {
                if (turtles === null) turtles = {};
                if (!turtles.hasOwnProperty(result.user.uid)) {
                    registerUser(result.user);
                }
            });
        }).catch((error) => {
            console.log(error);
        });
    }
}

export { join };