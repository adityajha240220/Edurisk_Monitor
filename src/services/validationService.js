import { db } from "../lib/firebaseConfig.js";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";

export const getValidationRules = async () => {
  const snapshot = await getDocs(collection(db, "validationRules"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateValidationRules = async (id, rules) => {
  await setDoc(doc(db, "validationRules", id), rules, { merge: true });
  return { success: true };
};
