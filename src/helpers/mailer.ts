import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
  console.log({ email, emailType, userId });
  try {
    // create hashed token
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000,
      });
      console.log("verified");
    } else if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000,
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      auth: {
        user: process.env.email,
        pass: process.env.node,
      },
    });

    const mailOptions = {
      from: "fs21co044.vitthal@gmail.com>",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Account verification email!"
          : "Reset password email!",
      html: `<p>Click <a href="${
        process.env.DOMAIN
      }/verify?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/verify?token=${hashedToken} </p>`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
        return info;
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
