import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import getEnvVar from "./utils/getEnvVar";
import { User } from "./utils/types";
const PORT = 3001;

let refreshTokens: string[] = [];

app.use(express.json());

app.post("/get-new-tokens", (req, res) => {
  const { refreshToken } = req.body;
  console.log(refreshTokens);

  if (!refreshToken) {
    return res.status(400).send("No refresh token provided"); 
  }
  if (!refreshTokens.includes(refreshToken)) {
    return res.status(401).send("invalid refresh token");
  }

  try {
    const secretKey = getEnvVar("JWT_REFRESH_TOKEN_SECRET");
    const payload = jwt.verify(refreshToken, secretKey);
    if (typeof payload === "string") {
      return res.status(401).send("invalid refresh token. Expected to get object, but got string");
    }
    removeTokenFromRefreshTokensArr(refreshToken);

    const newPayload = { name: payload.name }
    const newAccessToken = getAccessToken(newPayload);
    const newRefreshToken = getRefreshToken(newPayload);
    refreshTokens.push(newRefreshToken);
    res.status(200).json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).send("invalid refresh token");
  }
})

function removeTokenFromRefreshTokensArr(tokenToRemove: string) {
  return refreshTokens = refreshTokens.filter(token => token !== tokenToRemove);
}

app.post("/login", (req, res) => {
  // assuming the user is authenticated
  const { name } = req.body;
  if (!name) return res.status(400).send("name must be provided");
  const user = { name };
  const accessToken = getAccessToken(user);
  const refreshToken = getRefreshToken(user);
  refreshTokens.push(refreshToken);
  res.status(200).json({ accessToken, refreshToken });
  console.log(refreshTokens);
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

