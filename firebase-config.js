import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyB3PN25h_raRh3RkIBfwSWI7W2OlIDc4vk",
  authDomain: "oddyseum-store.firebaseapp.com",
  projectId: "oddyseum-store",
  storageBucket: "oddyseum-store.firebasestorage.app",
  messagingSenderId: "707617764633",
  appId: "1:707617764633:web:305957f521f26c60824188",
  measurementId: "G-3GLB91K9TB"
};

export const app = initializeApp(firebaseConfig);