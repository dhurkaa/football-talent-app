const mongoose = require("mongoose");

const scoutReportSchema = new mongoose.Schema(
  {
    playerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Player",
      required: [true, "Player is required"]
    },

    scoutId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Scout",
      required: [true, "Scout is required"]
    },

    reportDate: {
      type: Date,
      default: Date.now
    },

    rating: {
      type: Number,
      required: [true, "Rating is required"],
      min: [1, "Rating must be at least 1"],
      max: [10, "Rating cannot be more than 10"]
    },

    strengths: {
      type: [String],
      default: []
    },

    weaknesses: {
      type: [String],
      default: []
    },

    recommendation: {
      type: String,
      required: [true, "Recommendation is required"],
      trim: true
    }
  },
  {
    timestamps: true
  }
);

scoutReportSchema.index({ playerId: 1 });
scoutReportSchema.index({ scoutId: 1 });
scoutReportSchema.index({ rating: -1 });

module.exports = mongoose.model("ScoutReport", scoutReportSchema);