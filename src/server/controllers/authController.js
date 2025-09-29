import { auth } from "../../lib/firebaseAdmin.js";

// Register new user
export const registerUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userRecord = await auth.createUser({
      email,
      password,
    });
    res.status(201).json({ message: "User registered successfully", user: userRecord });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Firebase Admin SDK does not verify password directly
    // Instead, use Firebase Auth REST API or custom token
    res.status(200).json({ message: "Login handled on frontend or via custom token" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

// Logout user (frontend handles token removal)
export const logoutUser = async (req, res) => {
  res.status(200).json({ message: "Logout handled on frontend" });
};
