import { db } from "../lib/firebaseConfig.js";
import { collection, getDocs, addDoc, setDoc, doc, deleteDoc } from "firebase/firestore";

export const getUsers = async () => {
  const snapshot = await getDocs(collection(db, "users"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const addUser = async (user) => {
  const docRef = await addDoc(collection(db, "users"), { ...user, createdAt: new Date() });
  return { id: docRef.id };
};

export const editUser = async (id, updates) => {
  await setDoc(doc(db, "users", id), updates, { merge: true });
  return { success: true };
};

export const deleteUser = async (id) => {
  await deleteDoc(doc(db, "users", id));
  return { success: true };
};
