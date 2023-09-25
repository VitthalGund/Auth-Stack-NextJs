import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

export const getDataFromToken = (request: NextRequest) => {
  try {
    const token = request.cookies.get("token")?.value || "";
    const decoded: JwtPayload = jwt.verify(
      token,
      process.env.TOKEN_SECRER!
    ) as JwtPayload & { id: string };
    console.log(decoded.id);
    return decoded["id"];
  } catch (error: any) {
    throw new Error(error.message);
  }
};
