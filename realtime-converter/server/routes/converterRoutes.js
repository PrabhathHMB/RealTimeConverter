const express = require("express");
const router = express.Router();
const imageController = require("../controllers/imageController");
const documentController = require("../controllers/documentController");
const mediaController = require("../controllers/mediaController");

// Image conversion routes
router.post("/image", imageController.convertImage);

// Document conversion routes
router.post("/document", documentController.convertDocument);

// Media (video/audio) conversion routes
router.post("/video", mediaController.convertMedia);
router.post("/audio", mediaController.convertMedia);

// Get conversion status
router.get("/status/:fileId", (req, res) => {
  // Placeholder for status tracking
  res.json({ status: "completed", fileId: req.params.fileId });
});

module.exports = router;
