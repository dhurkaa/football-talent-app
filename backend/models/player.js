const mongoose = require("mongoose");

const playerSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    fullName: {
      type: String,
      required: [true, "Player full name is required"],
      trim: true
    },

    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [15, "Player must be at least 15 years old"]
    },

    position: {
      type: String,
      required: [true, "Position is required"],
      enum: ["Goalkeeper", "Defender", "Midfielder", "Forward"]
    },

    nationality: {
      type: String,
      required: [true, "Nationality is required"],
      trim: true
    },

    height: {
      type: Number,
      default: 0
    },

    preferredFoot: {
      type: String,
      enum: ["Left", "Right", "Both", "Unknown"],
      default: "Unknown"
    },

    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: [true, "Team is required"]
    },

    marketValue: {
      type: Number,
      default: 0,
      min: [0, "Market value cannot be negative"]
    },

    stats: {
      goals: {
        type: Number,
        default: 0,
        min: 0
      },
      assists: {
        type: Number,
        default: 0,
        min: 0
      },
      matchesPlayed: {
        type: Number,
        default: 0,
        min: 0
      },
      yellowCards: {
        type: Number,
        default: 0,
        min: 0
      },
      redCards: {
        type: Number,
        default: 0,
        min: 0
      }
    },

    source: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

playerSchema.index({ fullName: 1 });
playerSchema.index({ teamId: 1 });
playerSchema.index({ position: 1 });
playerSchema.index({ owner: 1, fullName: 1, teamId: 1 }, { unique: true });

module.exports = mongoose.model("Player", playerSchema);
