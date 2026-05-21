const express = require("express");
const Player = require("../models/player");
const Team = require("../models/team");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const players = await Player.find({ owner: req.user._id })
      .populate("teamId", "name city stadium")
      .sort({ createdAt: -1 });

    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const team = await Team.findOne({
      _id: req.body.teamId,
      owner: req.user._id
    });

    if (!team) {
      return res.status(400).json({ message: "Team not found for this user" });
    }

    const player = await Player.create({ ...req.body, owner: req.user._id });

    const populatedPlayer = await Player.findById(player._id).populate(
      "teamId",
      "name city stadium"
    );

    res.status(201).json(populatedPlayer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const player = await Player.findOne({
      _id: req.params.id,
      owner: req.user._id
    }).populate(
      "teamId",
      "name city stadium"
    );

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    if (req.body.teamId) {
      const team = await Team.findOne({
        _id: req.body.teamId,
        owner: req.user._id
      });

      if (!team) {
        return res.status(400).json({ message: "Team not found for this user" });
      }
    }

    const player = await Player.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    ).populate("teamId", "name city stadium");

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const player = await Player.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.json({ message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
