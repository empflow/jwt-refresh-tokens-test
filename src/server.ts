import express from "express";
const app = express();

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

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
})

app.listen(3000, () => {
  console.log("listening on port 3000");
})
