// routes/auth.js
const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register a new user
router.post("/register", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  // Check if all required fields are provided
  if (!firstName || !lastName || !email || !password) {
    return res
      .status(400)
      .json({ message: "Please enter all required fields." });
  }

  try {
    // Create a new user with firstName and lastName
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
    });

    await newUser.save(); // Save the user to the database

    // Return a success response or JWT token
    res
      .status(201)
      .json({
        message: "User registered successfully",
        token: "fake-jwt-token",
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { userId: user.id };
    const token = jwt.sign(payload, "secret", { expiresIn: "1h" });

    res.json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
