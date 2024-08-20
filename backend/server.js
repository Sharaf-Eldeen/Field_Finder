const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
  console.log(`The server run in the ${process.env.envMode} mode at ${PORT}`);
});
