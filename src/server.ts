import dotenv from "dotenv";
dotenv.config();
import express from "express";
const app = express();
import jwt from "jsonwebtoken";
import getEnvVar from "./utils/getEnvVar";
import authorize from "./utils/authorize";
import { Post } from "./utils/types";

const posts: Post[] = [
  {
    "author": "Kyle",
    "title": "post 1",
    "body": "post by kyle",
  },
  {
    "author": "John",
    "title": "post 2",
    "body": "post by john!!!",
  },
]

app.use(express.json());

app.get("/posts", authorize, (req, res) => {
  const { name } = res.locals.payload;
  const postsByUser = posts.filter(post => post.author === name);
  res.status(200).json(postsByUser);
})

app.post("/posts", authorize, (req, res) => {
  const { title, body } = req.body;
  const { name } = res.locals.payload;
  if (!title || !body) {
    return res.status(400).send("both title and body must be present");
  }

  const post: Post = { author: name, title, body };
  posts.push(post);
  res.status(201).send("post created successfully");
})

app.post("/login", (req, res) => {
  // assuming the user is authenticated
  const { name } = req.body;
  const user = { name };
  const token = jwt.sign(user, getEnvVar("JWT_ACCESS_TOKEN_SECRET"));
  res.status(200).json({ token });
})

app.listen(3000, () => {
  console.log("listening on port 3000");
})
