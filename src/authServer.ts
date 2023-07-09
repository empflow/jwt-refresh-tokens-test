import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import getEnvVar from "./utils/getEnvVar";
import { User } from "./utils/types";
const PORT = 3001;

app.use(express.json());

app.post("/login", (req, res) => {
  // assuming the user is authenticated
  const { name } = req.body;
  if (!name) return res.status(400).send("name must be provided");
  const user = { name };
  const token = getAccessToken(user);
  const refreshToken = getRefreshToken(user);
  res.status(200).json({ token, refreshToken });
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})

function getAccessToken(user: User) {
  const secretKey = getEnvVar("JWT_ACCESS_TOKEN_SECRET");
  const nodeEnv = getEnvVar("NODE_ENV");
  const expiresIn = nodeEnv === "development" ? "15s" : "10m";
  return jwt.sign(user, secretKey, { expiresIn });
}

function getRefreshToken(user: User) {
  const secretKey = getEnvVar("JWT_REFRESH_TOKEN_SECRET");
  // expiration is handled separately
  return jwt.sign(user, secretKey);
}

