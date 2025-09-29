import { db } from "../lib/firebaseConfig.js";
import { collection, getDocs, addDoc, setDoc, doc } from "firebase/firestore";

export const getCMSSettings = async () => {
  const snapshot = await getDocs(collection(db, "cmsSettings"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const updateCMSSettings = async (id, settings) => {
  await setDoc(doc(db, "cmsSettings", id), settings, { merge: true });
  return { success: true };
};

export const triggerCMSSync = async (systemId) => {
  console.log("CMS Sync triggered for system:", systemId);
  // Optionally update Firestore to log sync
  const docRef = await addDoc(collection(db, "cmsSettings"), {
    systemId,
    lastSync: new Date(),
  });
  return { success: true, id: docRef.id };
};
