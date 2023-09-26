import connect from "@/dbConfig/dbConfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { email } = reqBody;

    console.log({ email });
    const id = await User.findOne({ email }).select("_id");

    const mail = await sendEmail({ email, emailType: "FORGOT", userId: id });

    return NextResponse.json({
      message: "verification Email has been sent!",
      success: true,
      mail,
    });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
