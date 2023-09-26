// "use client";
import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function GET(request: NextRequest) {
  NextResponse.json({ message: "Hello" });
}

/**
 * Handles the creation of a new user.
 * @param request - The request object containing the user data in the request body.
 * @returns A response indicating the success or failure of the user creation.
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    console.log(
      `username: ${username}\nemail: ${email}\npassword: ${password}`
    );

    if (!username || !email || !password) {
      return NextResponse.json({
        message: "insufficient details",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        message: "User already exists!",
        status: 400,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const createdUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await createdUser.save();
    console.log(savedUser);

    const mail = await sendEmail({
      email,
      emailType: "VERIFY",
      userId: savedUser._id,
    });
    console.log(mail);
    return NextResponse.json({
      message: "User created successfully!",
      success: true,
      user: savedUser,
    });
  } catch (error: any) {
    console.log(error);
    return NextResponse.json({ message: error.message, status: 500 });
  }
}
