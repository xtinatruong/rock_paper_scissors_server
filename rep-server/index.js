const dotenv = require("dotenv");
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const roomHandler = require("./roomHandler");

dotenv.config();
const app = express();

const httpServer = createServer(app);
const mainServer = new Server(httpServer, {
  cors: { origin: "*" },
});

const rooms = [];
let master = false;

//update existing room info
update = (payload) => {
  console.log("in replica update function.");
  if(rooms.length > 0) {
    for (room of rooms) {
      if (room.roomId === payload.roomId) {
        //update data??
        room = payload; 
        console.log("copied: updated room: " + room.roomId);
      }
    }
  }
}

//create new room object
create = (payload) => {
  rooms.push(payload);
  console.log("copied: new room: " + payload.roomId);
}

mainServer.on("connection", (socket) => {
  console.log("Replica server connected", socket.id);

  //if the proxy sends a message that
  //its the new master then
  //master = true; 

  if(master) {
    roomHandler(mainServer, socket, rooms);
  } else {
    // update DB/rooms 
    console.log("replica server connected")
    socket.on("room:copy.update", update);
    socket.on("room:copy.create", create);
  }

  socket.on("disconnect", () => {
    console.log("disconnected", socket.id);
  });
});

const port = process.env.PORT || 5000;
httpServer.listen(port, () => console.log(`Listening on port ${port}`));
