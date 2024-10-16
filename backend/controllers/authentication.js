import { getUserByEmail, createUser } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const loginUser = async (req, res) => {
    try {
      console.log("hej");
      const user = await getUserByEmail(req.body.email);
      console.log("sfsdf" + user);
      // compare hashed password with input password (hashed)
    const passwordHash = await bcrypt.hash(user.password, 10);
      console.log(passwordHash);
      const passwordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
          // Generate JWT token
      const token = jwt.sign({ email: user.email, userid: user.user_id }, 
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
      );
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const registerUser = async (req, res) => {
    try {
        console.log("hej");
        const credentials = req.body;
        const alreadyExists = getUserByEmail(credentials.email);
        if(alreadyExists == true) {
            res.status(409).json("User already exists");
        }
        credentials.password = await bcrypt.hash(credentials.password, 10);
        createUser(credentials);
        console.log(credentials);
        res.status(200).json("Successfull registration");
    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    }
}