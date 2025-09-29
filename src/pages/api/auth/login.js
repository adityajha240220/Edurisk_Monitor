// src/pages/api/auth/login.js
import { loginUser } from "@/lib/auth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { email, password } = req.body;

  try {
    const userCredential = await loginUser(email, password);
    res.status(200).json({ user: userCredential.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
