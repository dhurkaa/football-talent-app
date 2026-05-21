const express = require("express");
const Match = require("../models/match");
const Team = require("../models/team");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const matches = await Match.find({ owner: req.user._id })
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
    const [homeTeam, awayTeam] = await Promise.all([
      Team.findOne({ _id: req.body.homeTeamId, owner: req.user._id }),
      Team.findOne({ _id: req.body.awayTeamId, owner: req.user._id })
    ]);

    if (!homeTeam || !awayTeam) {
      return res.status(400).json({ message: "Both teams must belong to the current user" });
    }

    const match = await Match.create({ ...req.body, owner: req.user._id });

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
    const match = await Match.findOne({
      _id: req.params.id,
      owner: req.user._id
    })
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
    const teamIdsToValidate = [req.body.homeTeamId, req.body.awayTeamId].filter(Boolean);
    if (teamIdsToValidate.length) {
      const validTeamCount = await Team.countDocuments({
        _id: { $in: teamIdsToValidate },
        owner: req.user._id
      });

      if (validTeamCount !== teamIdsToValidate.length) {
        return res.status(400).json({ message: "Both teams must belong to the current user" });
      }
    }

    const match = await Match.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
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
    const match = await Match.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!match) {
      return res.status(404).json({ message: "Match not found" });
    }

    res.json({ message: "Match deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
