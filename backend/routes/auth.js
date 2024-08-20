const express = require("express");
const { check, validationResult } = require("express-validator");
const User = require("../models/User.js");

const router = express.Router();

router.post(
  "/register",
  [
    check("username", "Username is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let userExists = await User.findOne({ email: email });
      if (userExists) {
        return res.status(400).json({
          errors: [{ param: "email", msg: "User already exists" }],
        });
      }

      let newUser = new User({
        username: username,
        email: email,
        password: password,
      });
      await newUser.save();
      const token = newUser.generateAuthKey();
      res.header("x-auth-token", token).status(200).json({ token: token });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email: email });
      if (!user) {
        return res.status(404).json({ message: "Invalid credentials" });
      }

      let isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(404).json({ message: "Invalid credentials" });
      }
      const token = user.generateAuthKey();
      res.header("x-auth-token", token).status(200).json({ token: token });
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  }
);

// Get user by ID
router.get("/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
