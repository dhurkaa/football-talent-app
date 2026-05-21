const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    name: {
      type: String,
      required: [true, "Team name is required"],
      trim: true,
    },

    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },

    foundedYear: {
      type: Number,
      required: [true, "Founded year is required"],
    },

    coachName: {
      type: String,
      required: [true, "Coach name is required"],
      trim: true,
    },

    stadium: {
      type: String,
      required: [true, "Stadium is required"],
      trim: true,
    },

    leagueName: {
      type: String,
      default: "ALBI MALL Superliga e Kosovës",
    },

    squadSize: {
      type: Number,
      default: 0,
    },

    averageAge: {
      type: Number,
      default: 0,
    },

    totalMarketValue: {
      type: Number,
      default: 0,
    },

    averageMarketValue: {
      type: Number,
      default: 0,
    },

    source: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

teamSchema.index({ owner: 1, name: 1 });

module.exports = mongoose.model("Team", teamSchema);
