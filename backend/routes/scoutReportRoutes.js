const express = require("express");
const ScoutReport = require("../models/scoutreport");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const reports = await ScoutReport.find()
      .populate("playerId", "fullName position nationality")
      .populate("scoutId", "fullName region email")
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", protect, async (req, res) => {
  try {
    const report = await ScoutReport.create(req.body);

    const populatedReport = await ScoutReport.findById(report._id)
      .populate("playerId", "fullName position nationality")
      .populate("scoutId", "fullName region email");

    res.status(201).json(populatedReport);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const report = await ScoutReport.findById(req.params.id)
      .populate("playerId", "fullName position nationality")
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
    const report = await ScoutReport.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )
      .populate("playerId", "fullName position nationality")
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
    const report = await ScoutReport.findByIdAndDelete(req.params.id);

    if (!report) {
      return res.status(404).json({ message: "Scout report not found" });
    }

    res.json({ message: "Scout report deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
