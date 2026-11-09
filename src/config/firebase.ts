import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCz6B2c4v4Nx_QjpTayUxxhAuGjEuRScGM",
  authDomain: "caminho-da-palavra-673e9.firebaseapp.com",
  projectId: "caminho-da-palavra-673e9",
  storageBucket: "caminho-da-palavra-673e9.firebasestorage.app",
  messagingSenderId: "647606557177",
  appId: "1:647606557177:web:a077cc786d71db8000c528"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa os serviços que vamos usar
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };