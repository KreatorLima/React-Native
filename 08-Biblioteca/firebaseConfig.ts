import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBPIuwN-ilKgjW7iqSTdgHX9PIMobe7izQ",
  authDomain: "biblioteca-ee107.firebaseapp.com",
  projectId: "biblioteca-ee107",
  storageBucket: "biblioteca-ee107.firebasestorage.app",
  messagingSenderId: "287502309498",
  appId: "1:287502309498:web:6be64cb34bda9aba3883c3",
  measurementId: "G-GGGTTDL9C4"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);