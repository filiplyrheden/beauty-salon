import { getUserByEmail, createUser } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const loginUser = async (req, res) => {
  try {
    const user = await getUserByEmail(req.body.email);
    // compare hashed password with input password (hashed)
    const passwordHash = await bcrypt.hash(user.password, 10);
    console.log(passwordHash);
    const passwordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userid: user.user_id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.status(200).json({ token: token });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const registerUser = async (req, res) => {
  try {
    const credentials = req.body;
    // Check if user already exists
    const alreadyExists = await getUserByEmail(credentials.email);
    if (alreadyExists) {
      // Use 409 status code for conflicts
      return res.status(409).json("User already exists");
    }

    // Hash password
    credentials.password = await bcrypt.hash(credentials.password, 10);

    // Create new user
    await createUser(credentials); // Ensure this function is properly inserting to the DB

    // Retrieve the created user
    const user = await getUserByEmail(credentials.email);
    // Generate JWT token
    const token = jwt.sign(
      { email: user.email, userid: user.user_id, role: user.role }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: process.env.JWT_EXPIRES_IN } // Expiration time
    );
    // Send the token in response
    return res.status(200).json({ token });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(500).json("User already exists");
    }
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
