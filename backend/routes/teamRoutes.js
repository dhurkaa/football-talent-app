const express = require("express");
const Team = require("../models/team");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find({ owner: req.user._id }).sort({ createdAt: -1 });
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const team = await Team.create({ ...req.body, owner: req.user._id });
    res.status(201).json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const team = await Team.findOne({ _id: req.params.id, owner: req.user._id });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    const team = await Team.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
      new: true,
      runValidators: true
      }
    );

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json(team);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const team = await Team.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    res.json({ message: "Team deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
