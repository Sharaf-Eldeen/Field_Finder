const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  googleId: {
    type: String,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  const saltRound = 10;
  this.password = await bcrypt.hash(this.password, saltRound);
  next();
});

userSchema.methods.matchPassword = async function (enterdPassword) {
  return await bcrypt.compare(enterdPassword, this.password);
};

userSchema.methods.generateAuthKey = function () {
  const secretKey = process.env.JWT_SECRET;
  const token = jwt.sign(
    { userId: this._id, userEmail: this.email },
    secretKey
  );
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
