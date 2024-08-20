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

module.exports = router;
