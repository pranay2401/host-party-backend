const express = require("express");
const http = require("http");
const router = require("./router");

const app = express();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "http://localhost:3000",
    mothods: ["GET", "POST"],
  },
});

const { addUser, removeUser, getUsersInRoom, getUser } = require("./users");

io.on("connection", (socket) => {
  console.log("We have a new connection!!!");

  socket.on("join", ({ userId, userName, room }) => {
    console.log(`${userName} joined with ${socket.id}`);
    addUser({ id: userId, name: userName, room });
    console.log(getUsersInRoom(room));
  });

  socket.on("disconnectTheSocket", ({ userId, userName, room }) => {
    console.log(`${userName} has left`);
    removeUser(userId);
    console.log(getUsersInRoom(room));
  });
});

app.use(router);

server.listen(PORT, () =>
  console.log(`Server has started listening on ${PORT}`)
);
