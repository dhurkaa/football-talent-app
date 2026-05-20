const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Scout full name is required"],
      trim: true
    },

    experienceYears: {
      type: Number,
      required: [true, "Experience years is required"],
      min: 0
    },

    region: {
      type: String,
      required: [true, "Region is required"],
      trim: true
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Scout", scoutSchema);