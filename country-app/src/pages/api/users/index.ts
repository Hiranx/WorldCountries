import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-config";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  await dbConnect();

  // Get user session for protected routes
  const session = await getServerSession(req, res, authOptions);

  // POST - Create new user
  if (req.method === "POST") {
    try {
      const { name, email, password } = req.body;

      // Validate input
      if (!name || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Check if user exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      // Create user (password will be hashed by pre-save hook)
      const user = new User({ name, email, password });
      await user.save();

      // Don't send back the password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(201).json({ 
        message: "User created successfully",
        user: userWithoutPassword
      });
    } catch (err) {
      console.error("Registration error:", err);
      return res.status(500).json({ 
        message: err instanceof Error ? err.message : "Server error" 
      });
    }
  }

  // PUT - Update user
  if (req.method === "PUT") {
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { name, email, currentPassword, newPassword } = req.body;

      // Find user
      const user = await User.findById(session.user.id).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify current password if changing password
      if (newPassword) {
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
          return res.status(400).json({ message: "Current password is incorrect" });
        }
      }

      // Update fields
      if (name) user.name = name;
      if (email) user.email = email;
      if (newPassword) user.password = newPassword;

      await user.save();

      // Don't send back the password
      const userWithoutPassword = user.toObject();
      delete userWithoutPassword.password;

      return res.status(200).json({ 
        message: "User updated successfully",
        user: userWithoutPassword
      });
    } catch (err) {
      console.error("Update error:", err);
      return res.status(500).json({ 
        message: err instanceof Error ? err.message : "Server error" 
      });
    }
  }

  // DELETE - Delete user account
  if (req.method === "DELETE") {
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { password } = req.body;

      // Find user
      const user = await User.findById(session.user.id).select("+password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password is incorrect" });
      }

      await User.findByIdAndDelete(session.user.id);

      return res.status(200).json({ 
        message: "Account deleted successfully"
      });
    } catch (err) {
      console.error("Delete error:", err);
      return res.status(500).json({ 
        message: err instanceof Error ? err.message : "Server error" 
      });
    }
  }

  return res.status(405).json({ message: "Method not allowed" });
}