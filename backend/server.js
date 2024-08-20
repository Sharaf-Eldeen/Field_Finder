const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");
const session = require("express-session");
const helmet = require("helmet");

dotenv.config();
const app = express();

app.use(cors());
app.use(
  session({
    secret: process.env.cookieSignKey,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`The server run in the ${process.env.envMode} mode at ${PORT}`);
});
