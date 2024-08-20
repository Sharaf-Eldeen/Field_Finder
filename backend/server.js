const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const helmet = require("helmet");
const mongoose = require("mongoose");

dotenv.config();
const app = express();
app.use(cors());

const passport = require("./middlewares/passport.js");

app.use(
  session({
    secret: process.env.cookieSignKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "img-src 'self' data: https://a.tile.openstreetmap.org https://b.tile.openstreetmap.org https://c.tile.openstreetmap.org http://localhost:5173;"
  );

  next();
});

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error(err);
  });

// Routes
const authRoutes = require("./routes/auth.js");
app.use("/api/auth", authRoutes);

const authGoogleRoutes = require("./routes/googleAuth.js");
app.use("/google", authGoogleRoutes);

const stadiumRoutes = require("./routes/stadiums");
app.use("/api/stadiums", stadiumRoutes);

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`The server run in the ${process.env.envMode}  mode at ${PORT}`);
});
