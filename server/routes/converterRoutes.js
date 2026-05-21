const express = require("express");
const router = express.Router();

const upload = require("../services/uploadService");

router.post(
  "/upload",
  upload.single("file"),
  async (req, res) => {
    try {
      res.json({
        success: true,
        file: req.file,
      });
    } catch (error) {
      res.status(500).json({
        error: error.message,
      });
    }
  }
);

module.exports = router;