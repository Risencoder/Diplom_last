import { doc, getDoc } from "firebase/firestore";
import { ref, get, child } from "firebase/database";
import { db, database } from "./firebase-config";

// Функція для зчитування даних з Firestore
export const getDoctorDataFirestore = async (doctorId) => {
  const docRef = doc(db, "doctors", doctorId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Firestore data:", docSnap.data());
    return docSnap.data();
  } else {
    console.log("No such document in Firestore!");
    return null;
  }
};

// Функція для зчитування даних з Realtime Database
export const getDoctorDataRealtime = async (doctorId) => {
  const dbRef = ref(database);
  try {
    const snapshot = await get(child(dbRef, `doctors/${doctorId}`));
    if (snapshot.exists()) {
      console.log("Realtime Database data:", snapshot.val());
      return snapshot.val();
    } else {
      console.log("No data available in Realtime Database");
      return null;
    }
  } catch (error) {
    console.error("Error fetching data from Realtime Database: ", error);
    return null;
  }
};
