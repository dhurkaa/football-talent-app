const express = require("express");
const Team = require("../models/team");
const Player = require("../models/player");
const Match = require("../models/match");
const Scout = require("../models/scout");
const ScoutReport = require("../models/scoutreport");
const { protect } = require("../middleware/authMiddleware");
const { getPremierLeagueNews } = require("../utils/premierLeagueNews");

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const owner = req.user._id;
    const [teams, players, matches, scouts, reports, news] = await Promise.all([
      Team.find({ owner }).sort({ createdAt: -1 }),
      Player.find({ owner }).populate("teamId", "name city stadium").sort({ createdAt: -1 }),
      Match.find({ owner })
        .populate("homeTeamId", "name city")
        .populate("awayTeamId", "name city")
        .sort({ matchDate: 1 }),
      Scout.find({ owner }).sort({ createdAt: -1 }),
      ScoutReport.find({ owner })
        .populate({
          path: "playerId",
          select: "fullName position nationality teamId",
          populate: {
            path: "teamId",
            select: "name"
          }
        })
        .populate("scoutId", "fullName region email")
        .sort({ createdAt: -1 }),
      getPremierLeagueNews(5)
    ]);

    res.json({
      teams,
      players,
      matches,
      scouts,
      reports,
      news,
      stats: {
        teamCount: teams.length,
        playerCount: players.length,
        matchCount: matches.length,
        scoutCount: scouts.length,
        reportCount: reports.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
