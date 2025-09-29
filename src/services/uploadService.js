import { db } from "../lib/firebaseConfig.js";
import { collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore";

export const getUploadHistory = async () => {
  const snapshot = await getDocs(collection(db, "uploads"));
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const rollbackUpload = async (id) => {
  await deleteDoc(doc(db, "uploads", id));
  return { success: true, message: "Upload rolled back" };
};

export const uploadFile = async (fileData) => {
  const docRef = await addDoc(collection(db, "uploads"), {
    name: fileData.name,
    createdAt: new Date(),
    status: "pending",
  });
  return { id: docRef.id, name: fileData.name };
};

// For download, since Firestore doesn’t store blobs, this is optional
// You might store URLs to Firebase Storage instead
export const downloadUpload = async (id) => {
  const docRef = doc(db, "uploads", id);
  const docSnap = await getDocs(docRef);
  if (!docSnap.exists()) throw new Error("Upload not found");
  return docSnap.data();
};
