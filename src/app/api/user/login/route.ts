import connect from "@/dbConfig/dbConfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

/**
 * Handles the creation of a new user.
 * @param request - The request object containing the user data in the request body.
 * @returns A response indicating the success or failure of the user creation.
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email, password } = reqBody;

    console.log(`email: ${email}\npassword: ${password}`);

    if (!email || !password) {
      return NextResponse.json({
        message: "insufficient details",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json(
        {
          message: "User doesn't exists!",
          success: false,
        },
        { status: 401 }
      );
    }

    const validatePassword = await bcryptjs.compare(
      password,
      existingUser.password
    );
    if (validatePassword) {
      let userData = {
        id: existingUser._id,
        username: existingUser.username,
        email: existingUser.email,
      };

      const token = jwt.sign(userData, process.env.TOKEN_SECRER!, {
        expiresIn: "3h",
      });

      const response = NextResponse.json({
        message: "Login successfully",
        success: true,
        username: existingUser.username,
        isVerified: existingUser.isVerified,
      });

      response.cookies.set("token", token, { httpOnly: true });
      return response;
    } else {
      return NextResponse.json(
        {
          message: "Invalid credentials!",
          success: false,
        },
        { status: 401 }
      );
    }
  } catch (error: any) {
    // console.log(error);
    return NextResponse.json({ message: error.message, status: 500 });
  }
}
