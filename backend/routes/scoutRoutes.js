const express = require("express");
const Scout = require("../models/scout");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const scouts = await Scout.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(scouts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const scout = await Scout.create({ ...req.body, owner: req.user._id });
    res.status(201).json(scout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const scout = await Scout.findOne({ _id: req.params.id, owner: req.user._id });

    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }

    res.json(scout);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const scout = await Scout.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
      new: true,
      runValidators: true
      }
    );

    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }

    res.json(scout);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const scout = await Scout.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!scout) {
      return res.status(404).json({ message: "Scout not found" });
    }

    res.json({ message: "Scout deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
