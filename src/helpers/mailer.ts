import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import connect from "@/dbConfig/dbConfig";

connect();

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
    } else if (emailType === "FORGOT") {
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
        pass: "xsmtpsib-3632fc79abf9f2130a14985ba65e43a6e99d1dd7fdcb262e8ec9ab97f62a8c21-A5kW7HM8Vj1T3NvY",
      },
    });

    const mailOptions = {
      from: "fs21co044.vitthal@gmail.com>",
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Account verification email!"
          : "Reset password email!",
      html: `<p>Click <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verify" : "password"
      }?token=${hashedToken}">here</a> to ${
        emailType === "VERIFY" ? "verify your email" : "reset your password"
      } or copy and paste the link below in your browser. <br> ${
        process.env.DOMAIN
      }/${
        emailType === "VERIFY" ? "verify" : "password"
      }?token=${hashedToken} </p>`,
    };

    console.log(mailOptions);

    return transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return { ...error, success: false };
      } else {
        console.log("Email sent: " + info.response);
        return { ...info, success: true };
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
