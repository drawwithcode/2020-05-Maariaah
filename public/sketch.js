let socket = io();
let myColor = "white";
var seconds, minutes;
var timer;
var counter = 30;
let image;
let tickingSound;
let almostOverSound;
let finishSound;
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
//Drawing
function drawOtherMouse(data) {
  push();
  stroke(data.color);
  strokeWeight(data.strokeW);
  line(data.x, data.y, data.x2, data.y2);
  pop();
}

function preload() {}

function setup() {
  timer = createP("timer");
  tickingSound = loadSound("./sounds/tspt_alarm_clock_ticking_loop_002.mp3");
  almostOverSound = loadSound("./sounds/mixkit-vintage-warning-alarm-990.wav");
  finishSound = loadSound("./sounds/emergency_bell_alarm_small_ring.mp3");
  tasksText = createP("tasksText");
  turn = data.length - 1;
  toggleBtn = createButton("Eraser");
  toggleBtn.position(42, 100);
  toggleBtn.mouseClicked(toggleErase);
  createCanvas(windowWidth, windowHeight);
  background("black");
}

function draw() {
  if (!eraseEnable) {
    cursor("./images/pencil.png");
    toggleBtn.html("Eraser");
  } else {
    cursor("./images/eraser.png");
    toggleBtn.html("Pen");
  }
}

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
    tickingSound.play();
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
    tickingSound.stop();
    almostOverSound.play();
  } else {
    almostOverSound.stop();
    tickingSound.play();
  }

  if (turn !== 0) {
    //Reset timer
    if (counter === 0) {
      counter = 30;
      turn--;
      clear();
      background("black");
    }
  } else {
    //Stop the timer
    clearInterval(myTimer);
    myTimer = 0;
    if (counter === 0) {
      tasksText.html("Thank you for playing the game");
      almostOverSound.stop();
      finishSound.play();
    }
  }
}, 500);

// Draw my sketch
function mouseDragged() {
  var color;
  var strokeW;

  if (eraseEnable) {
    color = "black";
    strokeW = 20;
  } else {
    color = myColor;
    var strokeW = 10;
  }
  strokeWeight(strokeW);
  stroke(color);
  line(pmouseX, pmouseY, mouseX, mouseY);

  let message = {
    x: mouseX,
    y: mouseY,
    x2: pmouseX,
    y2: pmouseY,
    color: color,
    strokeW: strokeW,
  };
  //send to server
  socket.emit("mouse", message);
}
