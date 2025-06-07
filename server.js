require("dotenv").config(); // Load .env variables
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = process.env.SECRET_KEY || "default_secret"; // Fallback for safety
const USERS_FILE = "users.json";

// Load users from file
const loadUsers = () => {
  if (!fs.existsSync(USERS_FILE)) return [];
  const data = fs.readFileSync(USERS_FILE);
  return JSON.parse(data);
};

// Save users to file
const saveUsers = (users) => {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
};

// ✅ Root route for health check
app.get("/", (req, res) => {
  res.send("Backend API is running ✅");
});

// ✅ Register route
app.post("/api/register", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const existingUser = users.find((u) => u.email === email);
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ email, password: hashedPassword });
  saveUsers(users);

  res.json({ message: "Registered successfully" });
});

// ✅ Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const users = loadUsers();

  const user = users.find((u) => u.email === email);
  if (!user) {
    return res.status(401).json({ message: "User not found" });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ message: "Incorrect password" });
  }

  const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// ✅ Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
