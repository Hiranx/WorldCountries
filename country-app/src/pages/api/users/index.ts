import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      // Check if user exists
      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Consistent salt rounds (10 to match your existing hashes)
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password.trim(), salt);

      const user = new User({ 
        name: name.trim(),
        email: email.toLowerCase().trim(),
        password: hashedPassword 
      });
      
      await user.save();

      return res.status(201).json({ 
        message: "User created",
        debug: {
          email: email,
          hash: hashedPassword,
          saltRounds: 10
        }
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ message: "Server error" });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}