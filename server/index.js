const cors = require("cors");
const { Blockchain } = require("./Blockchain");
const io = require("socket.io")(8080, {
  cors: {
    origin: "*",
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("createRoom", (data) => {
    if (rooms[data.room] === undefined) {
      rooms[data.room] = new Blockchain();
      socket.join(data.room);
      socket.emit("sysmsg", {
        room: data.room,
        messages: [],
        data: `created room ${data.room}`,
      });
    } else {
      socket.emit("syserr", { err: "Room Already Exists" });
    }
  });
  socket.on("joinRoom", (data) => {
    if (rooms[data.room] !== undefined) {
      socket.join(data.room);
      socket.emit("sysmsg", {
        room: data.room,
        messages: rooms[data.room].getBlocksData(),
        data: `Joining room ${data.room}`,
      });
    } else {
      socket.emit("syserr", { err: "Room Doesnt Exist" });
    }
  });
  socket.on("message", (data) => {
    rooms[data.room].addBlock({
      pic: data.pic,
      name: data.name,
      message: data.message,
    });
    io.sockets
      .in(data.room)
      .emit("message", rooms[data.room].getBlocksData().pop());
  });
});
