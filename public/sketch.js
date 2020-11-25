let socket = io();
let myColor = "white";
var seconds, minutes;
var timer;
var counter = 20;
let img;
var data = [
  "BANANA",
  "PHONE",
  "BIRD",
  "HUMAN",
  "HORSE",
  "CAR",
  "PUMP",
  "TRUCK",
];
var object;
var turn;
let eraseEnable = false;

socket.on("connection", newConnection);
socket.on("mouseBroadcast", drawOtherMouse);
socket.on("color", setColor);

function newConnection() {
  console.log("new connection" + socket.id);
}

function setColor(assignedColor) {
  myColor = assignedColor;
}

// Display data from other client
function drawOtherMouse(data) {
  push();
  stroke(data.color);
  strokeWeight(3);
  line(data.x, data.y, data.x2, data.y2);
  pop();
}

function preload() {}

function setup() {
  timer = createP("timer");
  tasksText = createP("tasksText");
  turn = data.length - 1;
  toggleBtn = createButton("Eraser");
  toggleBtn.position(42, 100);
  toggleBtn.mouseClicked(toggleErase);
  createCanvas(windowWidth, windowHeight);
  background("black");
}

function draw() {}

//Eraser
function toggleErase() {
  if (eraseEnable) {
    eraseEnable = false;
  } else {
    eraseEnable = true;
  }
}

//timer
const myTimer = setInterval(function myTimer() {
  // 1 counter = 1 second
  if (counter > 0) {
    counter--;
  }

  minutes = floor(counter / 60);
  seconds = counter % 60;
  // if (counter < 60)
  //Timer
  timer.position(width / 2, 0);
  timer.style("color", "white");
  timer.style("font-size", "42px");
  timer.html(minutes + ":" + seconds);
  //Timer text
  tasksText.style("color", "white");
  tasksText.style("font-size", "42px");
  tasksText.style("margin", "0 auto");
  tasksText.style("display", "block");
  tasksText.position(42, 30);
  tasksText.html("draw a " + data[turn]);

  if (counter < 4) {
    timer.style("color", "red");
  }

  if (turn !== 0) {
    //Reset timer
    if (counter === 0) {
      counter = 10;
      turn--;
    }
  } else {
    //Stop the timer
    clearInterval(myTimer);
    myTimer = 0;
    if (counter === 0) {
      tasksText.html("Thank you for playing the game");
    }
  }
}, 500);

// Draw my sketch
function mouseDragged() {
  if (eraseEnable) {
    stroke("black");
    line(pmouseX, pmouseY, mouseX, mouseY);
    strokeWeight(20);
  } else {
    stroke(myColor);
    line(pmouseX, pmouseY, mouseX, mouseY);
  }
  let message = {
    x: mouseX,
    y: mouseY,
    x2: pmouseX,
    y2: pmouseY,
    color: myColor,
  };
  //send to server
  socket.emit("mouse", message);
}
