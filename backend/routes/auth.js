const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

// Since this is a single-owner shop app, there is no signup route.
// The owner's credentials are stored in .env and seeded once.
// This keeps it simple and secure.

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
// Body: { username, password }
// Returns: { token, username }
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required." });
    }

    // Compare with owner credentials stored in .env
    const validUsername = username === process.env.OWNER_USERNAME;
    const validPassword = await bcrypt.compare(password, process.env.OWNER_PASSWORD_HASH);

    if (!validUsername || !validPassword) {
      return res.status(401).json({ message: "Invalid username or password." });
    }

    // Create a JWT token valid for 7 days
    const token = jwt.sign(
      { username },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      username,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ─── GET /api/auth/verify ─────────────────────────────────────────────────────
// Call this on page load to check if the stored token is still valid
// Frontend sends token → backend verifies → returns ok or 401
const protect = require("../middleware/auth");

router.get("/verify", protect, (req, res) => {
  res.json({ valid: true, username: req.user.username });
});

module.exports = router;
