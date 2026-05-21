const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const Player = require("../models/player");
const { protect } = require("../middleware/authMiddleware");
const { validateScoutSelection } = require("../utils/premierLeagueData");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
};

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role = "player",
      selectedPremierLeagueTeamId = null,
      selectedPremierLeaguePlayerId = null
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Please fill all fields"
      });
    }

    if (role === "scout") {
      if (!selectedPremierLeagueTeamId || !selectedPremierLeaguePlayerId) {
        return res.status(400).json({
          message: "Scouts must select a Premier League team and player"
        });
      }

      await validateScoutSelection(
        selectedPremierLeagueTeamId,
        selectedPremierLeaguePlayerId
      );
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
      selectedPremierLeagueTeamId:
        role === "scout" ? Number(selectedPremierLeagueTeamId) : null,
      selectedPremierLeaguePlayerId:
        role === "scout" ? Number(selectedPremierLeaguePlayerId) : null
    });

    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        selectedPremierLeagueTeamId: user.selectedPremierLeagueTeamId,
        selectedPremierLeaguePlayerId: user.selectedPremierLeaguePlayerId
      },
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          selectedPremierLeagueTeamId: user.selectedPremierLeagueTeamId,
          selectedPremierLeaguePlayerId: user.selectedPremierLeaguePlayerId
        },
        token: generateToken(user._id)
      });
    }

    res.status(401).json({
      message: "Invalid email or password"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
});

router.get("/profile", protect, async (req, res) => {
  res.json(req.user);
});

router.patch("/scout-preferences", protect, async (req, res) => {
  try {
    const { selectedPremierLeagueTeamId, selectedPremierLeaguePlayerId } = req.body;

    if (!selectedPremierLeagueTeamId || !selectedPremierLeaguePlayerId) {
      return res.status(400).json({
        message: "Please select both a Premier League team and player"
      });
    }

    await validateScoutSelection(
      selectedPremierLeagueTeamId,
      selectedPremierLeaguePlayerId
    );

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        selectedPremierLeagueTeamId: Number(selectedPremierLeagueTeamId),
        selectedPremierLeaguePlayerId: Number(selectedPremierLeaguePlayerId)
      },
      {
        new: true
      }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/watchlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "watchlist",
      match: { owner: req.user._id },
      populate: {
        path: "teamId",
        select: "name city stadium"
      }
    });

    res.json(user?.watchlist || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/watchlist/:playerId", protect, async (req, res) => {
  try {
    const player = await Player.findOne({
      _id: req.params.playerId,
      owner: req.user._id
    });

    if (!player) {
      return res.status(404).json({ message: "Player not found" });
    }

    await User.updateOne(
      { _id: req.user._id },
      { $addToSet: { watchlist: player._id } }
    );

    res.status(201).json({ message: "Player added to watchlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/watchlist/:playerId", protect, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $pull: { watchlist: req.params.playerId } }
    );

    res.json({ message: "Player removed from watchlist" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
