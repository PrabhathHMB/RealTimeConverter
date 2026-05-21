const express = require("express");
const router = express.Router();
const historyService = require("../services/historyService");

router.get("/", async (req, res) => {
  try {
    const history = await historyService.getHistory();
    res.json({ history });
  } catch (error) {
    console.error("History read error:", error);
    res.status(500).json({ error: "Could not read conversion history" });
  }
});

module.exports = router;
