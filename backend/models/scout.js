const mongoose = require("mongoose");

const scoutSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

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
      lowercase: true,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

scoutSchema.index({ owner: 1, email: 1 }, { unique: true });

module.exports = mongoose.model("Scout", scoutSchema);
