const express = require("express");
const Match = require("../models/match");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const matches = await Match.find()
      .populate("homeTeamId", "name city")
      .populate("awayTeamId", "name city")
      .sort({ matchDate: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const match = await Match.create(req.body);

    const populatedMatch = await Match.findById(match._id)
      .populate("homeTeamId", "name city")
      .populate("awayTeamId", "name city");

    res.status(201).json(populatedMatch);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate("homeTeamId", "name city")
      .populate("awayTeamId", "name city");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    })
      .populate("homeTeamId", "name city")
      .populate("awayTeamId", "name city");

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
