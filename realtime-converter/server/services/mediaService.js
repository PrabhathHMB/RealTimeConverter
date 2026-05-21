const ffmpegPath = require("ffmpeg-static");
const ffmpeg = require("fluent-ffmpeg");
const fs = require("fs").promises;

ffmpeg.setFfmpegPath(ffmpegPath);

exports.convertMedia = ({ inputPath, outputPath, toFormat, onProgress }) => {
  return new Promise((resolve, reject) => {
    try {
      const command = ffmpeg(inputPath).output(outputPath).on("progress", (progress) => {
        // progress.percent can be undefined for some inputs; guard it
        const percent = progress.percent ? Math.floor(progress.percent) : 0;
        onProgress?.(percent);
      });

      command.on("end", async () => {
        try {
          const stats = await fs.stat(outputPath);
          onProgress?.(100);
          resolve({ success: true, size: stats.size, path: outputPath });
        } catch (err) {
          reject(new Error(`Could not stat output file: ${err.message}`));
        }
      });

      command.on("error", (err) => {
        reject(new Error(`FFmpeg error: ${err.message}`));
      });

      // start processing
      command.run();
    } catch (err) {
      reject(new Error(`Media conversion failed: ${err.message}`));
    }
  });
};
