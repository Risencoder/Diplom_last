import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDsnoSxJHhRbPKL1qDarQx_AOA-Kp_bztU",
  authDomain: "diplom-91299.firebaseapp.com",
  projectId: "diplom-91299",
  storageBucket: "diplom-91299.appspot.com",
  messagingSenderId: "1011873913748",
  appId: "1:1011873913748:web:9b366dbad0154c88b74d81",
  measurementId: "G-2MQE1PBFC1"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);
const db = getFirestore();
const database = getDatabase(app, "https://diplom-91299-default-rtdb.europe-west1.firebasedatabase.app");
const auth = getAuth(app);

export { app, db, database, auth, storage };
