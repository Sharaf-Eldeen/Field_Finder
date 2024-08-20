const mongoose = require("mongoose");
const slugify = require("slugify");

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
    validate: {
      validator: function (v) {
        return /^01\d{9}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
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

stadiumSchema.index({ location: "2dsphere" });

stadiumSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

const Stadium = mongoose.model("stadiums", stadiumSchema);

module.exports = Stadium;
