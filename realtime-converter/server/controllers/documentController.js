const documentService = require("../services/documentService");
const path = require("path");

exports.convertDocument = async (req, res) => {
  try {
    const { fileId, toFormat } = req.body;

    if (!fileId || !toFormat) {
      return res.status(400).json({
        error: "Missing required fields: fileId, toFormat",
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
      status: "Starting document conversion...",
    });

    const result = await documentService.convertDocument({
      inputPath,
      outputPath,
      toFormat,
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
      message: "Document converted successfully",
      file: {
        filename: outputFilename,
        path: `/converted/${outputFilename}`,
      },
    });
  } catch (error) {
    console.error("Document conversion error:", error);
    res.status(500).json({ error: error.message });
  }
};
