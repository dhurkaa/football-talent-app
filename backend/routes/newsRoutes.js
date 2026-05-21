const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getPremierLeagueNews } = require("../utils/premierLeagueNews");

const router = express.Router();

router.get("/premier-league", protect, async (req, res) => {
  try {
    const news = await getPremierLeagueNews();
    res.json({
      competition: "Premier League",
      country: "England",
      source: "BBC Sport Premier League RSS",
      items: news
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
