const { exec } = require("child_process");
const { promisify } = require("util");
const fs = require("fs").promises;

const execAsync = promisify(exec);

exports.convertDocument = async ({
  inputPath,
  outputPath,
  toFormat,
  onProgress,
}) => {
  try {
    // Check if LibreOffice is installed
    try {
      await execAsync("which libreoffice || where libreoffice");
    } catch {
      throw new Error(
        "LibreOffice not installed. Please install it: brew install libreoffice"
      );
    }

    onProgress?.(25);

    const outputDir = outputPath.substring(0, outputPath.lastIndexOf("/"));

    // Build LibreOffice command
    let command = `libreoffice --headless --convert-to ${toFormat} "${inputPath}" --outdir "${outputDir}"`;

    onProgress?.(50);

    // Execute conversion
    await execAsync(command, { timeout: 60000 });

    onProgress?.(75);

    // Wait a moment for file to be written
    await new Promise((resolve) => setTimeout(resolve, 500));

    const stats = await fs.stat(outputPath);

    onProgress?.(100);

    return {
      success: true,
      size: stats.size,
      path: outputPath,
    };
  } catch (error) {
    throw new Error(`Document conversion failed: ${error.message}`);
  }
};
