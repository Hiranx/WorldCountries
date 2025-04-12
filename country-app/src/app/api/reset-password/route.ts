// src/app/api/reset-password/route.ts
import { NextResponse } from "next/server";
import User from "@/models/User";
import dbConnect from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  await dbConnect();
  
  try {
    const { email, newPassword } = await req.json();
    const user = await User.findOne({ email });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const salt = await bcrypt.genSalt(12);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully"
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}