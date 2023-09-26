import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

connect();

/**
 * Handles a POST request to reset a user's password based on a token provided in the request body.
 * @param request - The request object containing the token and new password in the request body.
 * @returns A JSON response with a success message if the password reset was successful, or an error message if an error occurred.
 */
export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { token, password } = reqBody;
    console.log(token);

    const user = await User.findOne({
      forgotPasswordToken: token,
      forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid token", success: true },
        { status: 400 }
      );
    }

    console.log(user);

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const resp = await User.findOneAndUpdate(
      {
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
      },
      {
        isVerified: true,
        forgotPasswordToken: undefined,
        forgotPasswordTokenExpiry: undefined,
        password: hashedPassword,
      }
    );

    return NextResponse.json({
      message: "Password reset successfully!",
      success: true,
      info: resp,
    });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message, success: true },
      { status: 500 }
    );
  }
}
