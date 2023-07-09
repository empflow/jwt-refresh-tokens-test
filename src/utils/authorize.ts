import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import getEnvVar from "./getEnvVar";

export default function authorize(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const authHeaderRegex = /^Bearer .+$/;
  if (!authHeader || !authHeaderRegex.test(authHeader)) {
    return res.status(401).send("unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const secretKey = getEnvVar("JWT_ACCESS_TOKEN_SECRET");
  try {
    const payload = jwt.verify(token, secretKey);
    if (typeof payload === "string") {
      return res.status(401).send("invalid access token");
    }
    res.locals.payload = payload;
    next();
  } catch (err) {
    res.status(401).send("unauthorized");
  }
}
