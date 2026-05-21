const mediaService = require("../services/mediaService");
const path = require("path");

exports.convertMedia = async (req, res) => {
  try {
    const { fileId, toFormat } = req.body;
    if (!fileId || !toFormat) {
      return res.status(400).json({ error: "Missing required fields: fileId, toFormat" });
    }

    const inputPath = path.join(__dirname, "../uploads", fileId);
    const outputFilename = `${Date.now()}-converted.${toFormat}`;
    const outputPath = path.join(__dirname, "../converted", outputFilename);

    const io = global.io;
    io.emit("conversionProgress", { fileId, percent: 10, status: "Starting media conversion..." });

    const result = await mediaService.convertMedia({
      inputPath,
      outputPath,
      toFormat,
      onProgress: (percent) => {
        io.emit("conversionProgress", { fileId, percent, status: `Converting... ${percent}%` });
      },
    });

    io.emit("conversionProgress", { fileId, percent: 100, status: "Completed!" });

    res.json({ success: true, message: "Media converted successfully", file: { filename: outputFilename, path: `/converted/${outputFilename}`, size: result.size } });
  } catch (error) {
    console.error("Media conversion error:", error);
    res.status(500).json({ error: error.message });
  }
};
