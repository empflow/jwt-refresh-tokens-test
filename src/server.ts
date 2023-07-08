import dotenv from "dotenv";
import express from "express";
const app = express();
const PORT = process.env.PORT || 3000;
import bcrypt from "bcrypt";

interface User {
  name: string,
  password: string
}

const users: User[] = []

app.use(express.json());

app.get("/users", (req, res) => {
  res.json(users);
})

app.post("/users", async (req, res) => {
  try {
    const { name, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { name, password: hashedPassword };
    users.push(user);
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ message: "Unable to hash password" })
  }
})

app.post("/users/login", async (req, res) => {
  const { name, password } = req.body;
  const user = users.find(user => user.name === name);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const doPasswordsMatch = await bcrypt.compare(password, user.password);
  if (!doPasswordsMatch) {
    return res.status(401).json({ message: "Invalid credentials" })
  }

  return res.status(200).json(user);
})

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
})
