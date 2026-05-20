const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();

app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.get("/", (req, res) => {
  res.send("Converter API Running");
});

io.on("connection", (socket) => {
  console.log("User connected");
});

server.listen(5000, () => {
  console.log("Server running on port 5000");
});