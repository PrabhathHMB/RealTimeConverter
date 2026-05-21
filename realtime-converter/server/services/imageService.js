const sharp = require("sharp");
const fs = require("fs").promises;

exports.convertImage = async ({
  inputPath,
  outputPath,
  toFormat,
  quality = 90,
  onProgress,
}) => {
  try {
    onProgress?.(25);

    let pipeline = sharp(inputPath);

    // Apply format-specific transformations
    switch (toFormat.toLowerCase()) {
      case "jpg":
      case "jpeg":
        pipeline = pipeline.jpeg({ quality, progressive: true });
        break;
      case "png":
        pipeline = pipeline.png({ compressionLevel: 9 });
        break;
      case "webp":
        pipeline = pipeline.webp({ quality });
        break;
      case "avif":
        pipeline = pipeline.avif({ quality });
        break;
      default:
        throw new Error(`Unsupported format: ${toFormat}`);
    }

    onProgress?.(50);

    // Save the converted image
    await pipeline.toFile(outputPath);

    onProgress?.(75);

    // Get file size
    const stats = await fs.stat(outputPath);

    onProgress?.(100);

    return {
      success: true,
      size: stats.size,
      path: outputPath,
    };
  } catch (error) {
    throw new Error(`Image conversion failed: ${error.message}`);
  }
};
