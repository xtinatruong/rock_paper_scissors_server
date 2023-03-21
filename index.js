const dotenv = require("dotenv");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const roomHandler = require("./roomHandler");
const { io } = require("socket.io-client");

dotenv.config();
const app = express();

const httpServer = createServer(app);
const mainServer = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = [];
let master = true;
let replicaSocket = null;

connectRepl = () => {
  replicaSocket = io("localhost:5000");

}

mainServer.on("connection", (socket) => {
  console.log("connected", socket.id);
  if(master) {
    connectRepl();
    roomHandler(mainServer, socket, rooms, replicaSocket);
    
  }

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

const port = process.env.PORT || 8080;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
