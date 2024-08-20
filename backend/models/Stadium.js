const mongoose = require("mongoose");

const stadiumSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  pricePerHour: {
    type: Number,
    required: true,
  },
  ownerPhone: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    unique: true,
    required: true,
  },
  images: {
    type: [String],
  },
  details: {
    type: String,
  },
  email: {
    type: String,
    required: true,
  },
});

const Stadium = mongoose.model("stadiums", stadiumSchema);

module.exports = Stadium;
