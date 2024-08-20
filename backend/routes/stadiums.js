const express = require("express");
const { check, validationResult } = require("express-validator");
const Stadium = require("../models/Stadium");
const slugify = require("slugify");

const router = express.Router();

// Create a new stadium
router.post(
  "/",
  [
    check("name", "Name is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    check("pricePerHour", "Price per hour must be a number").isNumeric(),
    check("ownerPhone", "Owner phone must be a number").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, city, pricePerHour, ownerPhone, email } = req.body;

      const stadium = new Stadium({
        name,
        city,
        pricePerHour,
        ownerPhone,
        slug: slugify(name, { lower: true, strict: true }),
        email,
      });

      await stadium.save();
      res.status(201).json(stadium);
    } catch (error) {
      console.error("Error creating stadium:", error);
      res.status(500).json({ error: "Server error" });
    }
  }
);

// Get all stadiums
router.get("/", async (req, res) => {
  try {
    const stadiums = await Stadium.find();
    res.status(200).json(stadiums);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get a single stadium by slug
router.get("/:slug", async (req, res) => {
  try {
    const stadium = await Stadium.findOne({ slug: req.params.slug });
    if (!stadium) {
      return res.status(404).json({ message: "Stadium not found" });
    }
    res.status(200).json(stadium);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
