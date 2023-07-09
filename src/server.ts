import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import getEnvVar from "./utils/getEnvVar";
import authorize from "./utils/authorize";

const posts = [
  {
    "username": "Kyle",
    "title": "post 1",
  },
  {
    "username": "John",
    "title": "post 2",
  },
]

app.use(express.json());

app.get("/posts", authorize, (req, res) => {
  res.status(200).json(posts);
})

app.post("/login", (req, res) => {
  // auhtenticate user
  const { name } = req.body;
  const user = { name };
  const token = jwt.sign(user, getEnvVar("JWT_ACCESS_TOKEN_SECRET"));
  res.status(200).json({ token });
})

app.listen(3000, () => {
  console.log("listening on port 3000");
})
