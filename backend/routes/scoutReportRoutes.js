const express = require("express");
const ScoutReport = require("../models/scoutreport");
const Player = require("../models/player");
const Scout = require("../models/scout");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const reports = await ScoutReport.find({ owner: req.user._id })
      .populate({
        path: "playerId",
        select: "fullName position nationality teamId",
        populate: {
          path: "teamId",
          select: "name"
        }
      })
      .populate("scoutId", "fullName region email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const [player, scout] = await Promise.all([
      Player.findOne({ _id: req.body.playerId, owner: req.user._id }),
      Scout.findOne({ _id: req.body.scoutId, owner: req.user._id })
    ]);

    if (!player || !scout) {
      return res.status(400).json({ message: "Player and scout must belong to the current user" });
    }

    const report = await ScoutReport.create({ ...req.body, owner: req.user._id });

    const populatedReport = await ScoutReport.findById(report._id)
      .populate({
        path: "playerId",
        select: "fullName position nationality teamId",
        populate: {
          path: "teamId",
          select: "name"
        }
      })
      .populate("scoutId", "fullName region email");

    res.status(201).json(populatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const report = await ScoutReport.findOne({
      _id: req.params.id,
      owner: req.user._id
    })
      .populate({
        path: "playerId",
        select: "fullName position nationality teamId",
        populate: {
          path: "teamId",
          select: "name"
        }
      })
      .populate("scoutId", "fullName region email");

    if (!report) {
      return res.status(404).json({ message: "Scout report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", protect, async (req, res) => {
  try {
    if (req.body.playerId || req.body.scoutId) {
      const [player, scout] = await Promise.all([
        req.body.playerId ? Player.findOne({ _id: req.body.playerId, owner: req.user._id }) : true,
        req.body.scoutId ? Scout.findOne({ _id: req.body.scoutId, owner: req.user._id }) : true
      ]);

      if (!player || !scout) {
        return res.status(400).json({ message: "Player and scout must belong to the current user" });
      }
    }

    const report = await ScoutReport.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate({
        path: "playerId",
        select: "fullName position nationality teamId",
        populate: {
          path: "teamId",
          select: "name"
        }
      })
      .populate("scoutId", "fullName region email");

    if (!report) {
      return res.status(404).json({ message: "Scout report not found" });
    }

    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const report = await ScoutReport.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id
    });

    if (!report) {
      return res.status(404).json({ message: "Scout report not found" });
    }

    res.json({ message: "Scout report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
