const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const ADMIN_EMAIL = "admin@example.com";
const ADMIN_PASSWORD = "Admin@123";

router.post("/register", async (req, res) => {
  const { name, email, phone, address, dob, department, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      phone,
      address,
      dob,
      department, 
      password: hashedPassword
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === ADMIN_EMAIL) {
      if (password !== ADMIN_PASSWORD) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: "admin123", department: "admin" }, "secretkey", { expiresIn: "1h" });

      return res.json({ token, user: { name: "Admin", department: "admin" } });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, department: user.department }, "secretkey", { expiresIn: "1h" });

    res.json({ token, user: { name: user.name, department: user.department } });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, "name email phone department"); 
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.delete("/users/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
