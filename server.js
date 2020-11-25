console.log("node is running");

let express = require("express");

let socket = require("socket.io");

let app = express();

var port = process.env.PORT || 2000;

let server = app.listen(port);

app.use(express.static("public"));

let io = socket(server);

io.on("connection", newConnection);

function newConnection(socket) {
  //console.log("new connection" + socket.client.id);

  socket.emit("color", getRandomColor());
  socket.on("mouse", mouseMessage);
  socket.on("timer", mouseMessage);

  function mouseMessage(data) {
    //console.log(socket.client.id, data);
    socket.broadcast.emit("mouseBroadcast", data);
  }
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}
