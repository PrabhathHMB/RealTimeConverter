const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use("/uploads", express.static("uploads"));
app.use("/converted", express.static("converted"));

// Store io instance globally for use in routes
global.io = io;

// Routes
const uploadRoutes = require("./routes/uploadRoutes");
const converterRoutes = require("./routes/converterRoutes");

app.use("/api/upload", uploadRoutes);
app.use("/api/convert", converterRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("🎥 Converter API Running on port 5000");
});

// Socket.IO connection
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
