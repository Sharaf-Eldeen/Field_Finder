const express = require("express");
const { check, validationResult } = require("express-validator");
const Stadium = require("../models/Stadium");
const slugify = require("slugify");
const uploader = require("../middlewares/uploadImages.js");

const router = express.Router();

// Create a new stadium
router.post(
  "/",
  uploader,
  [
    check("name", "Name is required").not().isEmpty(),
    check("city", "City is required").not().isEmpty(),
    check("email", "Email is required").not().isEmpty(),
    // check("details", "Details are required").not().isEmpty(),
    // check("location.type", "Location type is required").equals("Point"),
    // check(
    //   "location.coordinates",
    //   "Location coordinates must be an array"
    // ).isArray(),
    // check(
    //   "location.coordinates.*",
    //   "Location coordinates must be numbers"
    // ).isNumeric(),
    check("pricePerHour", "Price per hour must be a number").isNumeric(),
    check("ownerPhone", "Owner phone must be a number").isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, city, pricePerHour, ownerPhone, details, location, email } =
        req.body;

      const images = req.files.map((file) => file.filename) || [];

      const stadium = new Stadium({
        name,
        city,
        pricePerHour,
        ownerPhone,
        slug: slugify(name, { lower: true, strict: true }),
        details,
        location: JSON.parse(location),
        images,
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

/// Get all stadiums by email
router.get("/findMyOwnStaduims", async (req, res) => {
  try {
    const email = req.query.email;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Email query parameter is required" });
    }

    const stadiums = await Stadium.find({ email: email });
    if (!stadiums || stadiums.length === 0) {
      return res.status(404).json({ message: "Stadium not found" });
    }

    const updatedStadiums = stadiums.map((stadium) => ({
      ...stadium._doc,
      images: stadium.images.map((image) => `http://localhost:5500/${image}`),
    }));

    res.status(200).json({ stadiums: updatedStadiums });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get all stadiums
router.get("/", async (req, res) => {
  try {
    const { city = "", page = 1, limit = 10 } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const query = {
      $or: [
        { city: { $regex: city, $options: "i" } },
        { name: { $regex: city, $options: "i" } }, // Use the same 'city' parameter to search in 'name'
      ],
    };

    const options = {
      sort: { price: 1 },
      skip: (pageNum - 1) * limitNum,
      limit: limitNum,
    };

    const stadiums = await Stadium.find(query, null, options);
    const total = await Stadium.countDocuments(query);

    const updatedStadiums = stadiums.map((stadium) => ({
      ...stadium._doc,
      images: stadium.images.map((image) => `http://localhost:5500/${image}`),
    }));

    res.status(200).json({
      stadiums: updatedStadiums,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      totalItems: total,
    });
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

// Update a stadium by slug
router.put(
  "/:slug",
  uploader,
  [
    check("name", "Name is required").optional().not().isEmpty(),
    check("city", "City is required").optional().not().isEmpty(),
    check("email", "Email is required").optional().not().isEmpty(),
    check("location.type", "Location type is required")
      .optional()
      .equals("Point"),
    check("location.coordinates", "Location coordinates must be an array")
      .optional()
      .isArray(),
    check("location.coordinates.*", "Location coordinates must be numbers")
      .optional()
      .isNumeric(),
    check("pricePerHour", "Price per hour must be a number")
      .optional()
      .isNumeric(),
    check("ownerPhone", "Owner phone must be a number").optional().isNumeric(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Parse the location if it's sent as a string
    if (req.body.location) {
      try {
        req.body.location = JSON.parse(req.body.location);
      } catch (error) {
        return res.status(400).json({ message: "Invalid location format" });
      }
    }

    const updates = req.body;
    const images = req.files.map((file) => file.filename);

    if (updates.name) {
      updates.slug = slugify(updates.name, { lower: true, strict: true });
    }

    try {
      // First update: Handle all fields except images
      const stadium = await Stadium.findOneAndUpdate(
        { slug: req.params.slug },
        updates,
        { new: true }
      );
      if (!stadium) {
        return res.status(404).json({ message: "Stadium not found" });
      }

      // Second update: Push new images into the array
      if (images.length > 0) {
        await Stadium.findOneAndUpdate(
          { slug: req.params.slug },
          { $push: { images: { $each: images } } },
          { new: true }
        );
      }

      res.status(200).json(stadium);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Delete a stadium by slug
router.delete("/:slug", async (req, res) => {
  try {
    const stadium = await Stadium.findOneAndDelete({ slug: req.params.slug });
    if (!stadium) {
      return res.status(404).json({ message: "Stadium not found" });
    }
    res.status(200).json({ message: "Stadium deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
