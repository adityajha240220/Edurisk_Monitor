// src/pages/api/user/profile.js
import { auth } from "@/lib/firebaseConfig";

export default async function handler(req, res) {
  const user = auth.currentUser;
  if (!user) {
    return res.status(401).json({ message: "Not authenticated" });
  }
  res.status(200).json({ user });
}
