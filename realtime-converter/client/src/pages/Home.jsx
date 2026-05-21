import { useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import "../styles/Home.css";

const API_URL = "http://localhost:5000/api";
const socket = io("http://localhost:5000");

export default function Home() {
  const [file, setFile] = useState(null);
  const [toFormat, setToFormat] = useState("jpg");
  const [uploading, setUploading] = useState(false);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState([]);
  const [downloadUrl, setDownloadUrl] = useState(null);

  // Listen for real-time progress updates
  socket.on("conversionProgress", (data) => {
    setProgress(data.percent);
    addMessage(data.status);
  });

  const addMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const handleFileSelect = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      addMessage(`File selected: ${e.target.files[0].name}`);
    }
  };

  const handleUploadAndConvert = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    try {
      setUploading(true);
      addMessage("📤 Uploading file...");

      // Upload file
      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileId = uploadRes.data.file.id;
      addMessage(`✅ File uploaded: ${fileId}`);
      setUploading(false);

      // Determine endpoint
      const mimeTop = file.type.split("/")[0];
      let endpoint = "image";
      if (mimeTop === "image") endpoint = "image";
      else if (mimeTop === "video") endpoint = "video";
      else if (mimeTop === "audio") endpoint = "audio";
      else if (["pdf", "docx", "txt", "pptx"].includes(toFormat)) endpoint = "document";

      // Convert file
      setConverting(true);
      setProgress(0);
      addMessage(`🔄 Converting to ${toFormat} via ${endpoint}...`);

      const convertRes = await axios.post(`${API_URL}/convert/${endpoint}`, {
        fileId,
        fromFormat: file.type.split("/")[1] || "unknown",
        toFormat,
        quality: 90,
      });

      setDownloadUrl(convertRes.data.file.path);
      addMessage(`✅ Conversion complete!`);
      setConverting(false);
    } catch (error) {
      addMessage(`❌ Error: ${error.response?.data?.error || error.message}`);
      setUploading(false);
      setConverting(false);
    }
  };

  const handleDownload = () => {
    if (downloadUrl) {
      window.open(`http://localhost:5000${downloadUrl}`, "_blank");
    }
  };

  return (
    <div className="home-container">
      <div className="header">
        <h1>🎨 Real-Time Converter</h1>
        <p>Convert your images, videos, audio & documents instantly</p>
      </div>

      <div className="main-content">
        {/* Upload Zone */}
        <div className="upload-zone">
          <input
            type="file"
            id="file-input"
            onChange={handleFileSelect}
            style={{ display: "block" }}
            accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt,.ppt,.pptx"
          />
        </div>

        {/* File and Format Selection */}
        {file && (
          <div className="controls">
            <div className="file-display">
              <p>📄 {file.name}</p>
              <p className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>

            <div className="format-selector">
              <label>Convert to:</label>
              <select value={toFormat} onChange={(e) => setToFormat(e.target.value)}>
                <optgroup label="Images">
                  <option value="jpg">JPG</option>
                  <option value="png">PNG</option>
                  <option value="webp">WebP</option>
                  <option value="avif">AVIF</option>
                </optgroup>
                <optgroup label="Audio/Video">
                  <option value="mp3">MP3</option>
                  <option value="aac">AAC</option>
                  <option value="wav">WAV</option>
                  <option value="mp4">MP4</option>
                </optgroup>
                <optgroup label="Documents">
                  <option value="pdf">PDF</option>
                  <option value="docx">DOCX</option>
                  <option value="txt">TXT</option>
                  <option value="pptx">PPTX</option>
                </optgroup>
              </select>
            </div>

            <button
              onClick={handleUploadAndConvert}
              disabled={uploading || converting}
              className="convert-btn"
            >
              {uploading || converting ? "Processing..." : "Convert Now"}
            </button>
          </div>
        )}

        {/* Progress Bar */}
        {(uploading || converting) && (
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}>
                {progress}%
              </div>
            </div>
          </div>
        )}

        {/* Messages Log */}
        <div className="messages">
          {messages.map((msg, idx) => (
            <p key={idx} className="message">
              {msg}
            </p>
          ))}
        </div>

        {/* Download Button */}
        {downloadUrl && (
          <button onClick={handleDownload} className="download-btn">
            ⬇️ Download Converted File
          </button>
        )}
      </div>
    </div>
  );
}