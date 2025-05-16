
// src/lib/firebase.ts
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, type Auth } from "firebase/auth";
import { getStorage, type FirebaseStorage } from "firebase/storage"; // Import Firebase Storage
// import { getAnalytics, type Analytics } from "firebase/analytics"; // Analytics can be added later if needed

const firebaseConfig = {
  apiKey: "AIzaSyDg-LFktZlDEM3RA6CeDA3h6zpxvnQKGJc",
  authDomain: "practica-enurm.firebaseapp.com",
  projectId: "practica-enurm",
  storageBucket: "practica-enurm.appspot.com", // Canonical storage bucket name
  messagingSenderId: "871687048018",
  appId: "1:871687048018:web:bd0bc7443767621f5b488b",
  measurementId: "G-WBM6688EKB"
};

// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth: Auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const storage: FirebaseStorage = getStorage(app); // Initialize Firebase Storage

// let analytics: Analytics | undefined;
// if (typeof window !== 'undefined') {
//   analytics = getAnalytics(app);
// }

export { app, auth, googleProvider, storage }; // Export storage
