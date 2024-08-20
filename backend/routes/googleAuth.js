const express = require("express");
const passport = require("passport");

const router = express.Router();

router.get("/", (req, res) => {
  res.send('<a href="/google/auth/google">Authenticate with Google</a>');
});

router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["https://www.googleapis.com/auth/plus.login", "profile", "email"],
  })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "http://localhost:5173/",
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id, userEmail: req.user.email },
      process.env.JWT_SECRET
    );

    // Redirect with the token as a query parameter
    res.redirect(`http://localhost:5173/?token=${token}`);
  }
);

module.exports = router;
