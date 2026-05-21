const imageService = require("../services/imageService");
const path = require("path");

exports.convertImage = async (req, res) => {
  try {
    const { fileId, fromFormat, toFormat, quality } = req.body;

    if (!fileId || !fromFormat || !toFormat) {
      return res.status(400).json({
        error: "Missing required fields: fileId, fromFormat, toFormat",
      });
    }

    const inputPath = path.join(__dirname, "../uploads", fileId);
    const outputFilename = `${Date.now()}-converted.${toFormat}`;
    const outputPath = path.join(__dirname, "../converted", outputFilename);

    // Emit progress to client via Socket.IO
    const io = global.io;
    io.emit("conversionProgress", {
      fileId,
      percent: 10,
      status: "Starting conversion...",
    });

    const result = await imageService.convertImage({
      inputPath,
      outputPath,
      toFormat,
      quality: quality || 90,
      onProgress: (percent) => {
        io.emit("conversionProgress", {
          fileId,
          percent,
          status: `Converting... ${percent}%`,
        });
      },
    });

    io.emit("conversionProgress", {
      fileId,
      percent: 100,
      status: "Completed!",
    });

    res.json({
      success: true,
      message: "Image converted successfully",
      file: {
        filename: outputFilename,
        path: `/converted/${outputFilename}`,
        size: result.size,
      },
    });
  } catch (error) {
    console.error("Image conversion error:", error);
    res.status(500).json({ error: error.message });
  }
};
