const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema(
  {
    homeTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Home team is required"]
    },

    awayTeamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Away team is required"]
    },

    matchDate: {
      type: Date,
      required: [true, "Match date is required"]
    },

    stadium: {
      type: String,
      required: [true, "Stadium is required"],
      trim: true
    },

    scoreHome: {
      type: Number,
      default: 0,
      min: 0
    },

    scoreAway: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: ["scheduled", "played", "cancelled"],
      default: "scheduled"
    }
  },
  {
    timestamps: true
  }
);

matchSchema.index({ matchDate: 1 });
matchSchema.index({ homeTeamId: 1 });
matchSchema.index({ awayTeamId: 1 });

module.exports = mongoose.model("Match", matchSchema);