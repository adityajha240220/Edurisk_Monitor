// src/services/firebaseService.js
import { db } from "@/lib/firebaseConfig";
import { collection, addDoc, getDocs } from "firebase/firestore";

// Example: save student data
export const addStudent = async (student) => {
  return await addDoc(collection(db, "students"), student);
};

// Example: fetch all students
export const getStudents = async () => {
  const snapshot = await getDocs(collection(db, "students"));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
