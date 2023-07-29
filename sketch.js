// https://codepen.io/mediapipe/pen/jOMbvxw
// https://google.github.io/mediapipe/solutions/pose.html

let cam;
// image resources
let snakeImg;
let foodImg;
// the location of the snake
let snakeX;
let snakeY;
let snakeAngle;
// the target location of the snake
let targetX;
let targetY;
// variables of snake movement
let accelX, accelY;
let springing = .001, damping = .96;
// the location of food
let foodX;
let foodY;
// the position of the left wrist
let leftWristX;
let leftWristY;
// the position of the right wrist
let rightWristX;
let rightWristY;
// the palette
let palette;
// the score
let score;
// game over
let gameOver;
let overTimer;

let snakeAni;
let appleAni;
let font;

/** This function loads resources that will be used later. */
function preload() {
  snakeImg = loadImage("snack.png");
  foodImg = loadImage("food.png");
  font = loadFont("assets/Pilowlava-Regular.otf")
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  imageMode(CENTER);
  textFont(font);

  appleAni = loadAni('assets/PG_0000.png', 96);
  snakeAni = loadAni('assets/SNAKE2_0000.png', 49);

  // creates a new HTML5 <video> element that contains the audio/video feed from a webcam
  cam = createCapture(VIDEO, function () {
    update();
  });
  cam.hide();

  // foodImg.resize(100, 100);
  // snakeImg.resize(200, 450);

  palette = ["#a90019", "#a90019", "#a90019", "#a90019", "#a90019"];
  score = 0;
  updateFood();

  updateSnake();
  snakeAngle = 0;
  targetX = snakeX;
  targetY = snakeY;

  accelX = 0;
  accelY = 0;
  gameOver = false;
  overTimer = 100;
}

function draw() {
  background(255);
  image(cam, width / 2, height / 2, width, height);

  if (detections != undefined) {
    if (detections.poseLandmarks != undefined) {
      // draw all of connectors and landmarks
      // drawConnectors(detections.poseLandmarks, POSE_CONNECTIONS);
      // drawLandmarks(detections.poseLandmarks);

      // get the location coordinates of the detected wrists
      leftWristX = detections.poseLandmarks[15].x * width;
      leftWristY = detections.poseLandmarks[15].y * height;
      rightWristX = detections.poseLandmarks[16].x * width;
      rightWristY = detections.poseLandmarks[16].y * height;

      // displays the position of the wrists
      // ellipse(leftWristX, leftWristY, 20, 20);
      // ellipse(rightWristX, rightWristY, 20, 20);

      // right hand preferred
      if (leftWristX >= 0 && leftWristX <= width
        && leftWristY >= 0 && leftWristY <= height) {
        targetX = leftWristX;
        targetY = leftWristY;
      }

      if (rightWristX >= 0 && rightWristX <= width
        && rightWristY >= 0 && rightWristY <= height) {
        targetX = rightWristX;
        targetY = rightWristY;
      }

      let direction = createVector(targetX - snakeX, targetY - snakeY);
      snakeAngle = -PI / 2 + direction.heading();
    }
  }

  // game introduction
  if (millis() < 3000) {
    push();
    noStroke();
    // stroke(palette[3]);
    // strokeWeight(3);
    fill(palette[0]);
    textSize(60);
    textStyle(BOLD);
    textAlign(CENTER, CENTER);
    text("Serpent and Forbidden Fruit", width / 2, 180);

    // stroke(palette[4]);
    // fill(palette[2]);
    textSize(24);
    text("Serpent will keep moving forward,", width / 2, 260);
    text("use your hands to control its direction and", width / 2, 300);
    text("don't let Serpent eat the forbidden fruit,", width / 2, 340);
    text("otherwise everything will be over.", width / 2, 380);
    pop();
  } else if (gameOver == false) {
    // show food
    // image(foodImg, foodX, foodY);
    animation(appleAni, foodX, foodY);

    moveSnake();
    // show the snake
    push();
    translate(snakeX, snakeY);
    rotate(snakeAngle);
    // image(snakeImg, 0, -snakeImg.height / 2 + 50);
    animation(snakeAni, 0, -100);
    pop();

    // snake eats food
    if (dist(snakeX, snakeY, foodX, foodY) <= 80) {
      updateFood();
      score += 100;
    }

    showScore();
  }

  // game over
  if (snakeX < 0 || snakeX > width || snakeY < 0 || snakeY > height) {
    if (!gameOver) {
      gameOver = true;
    }

    if (gameOver) {
      overTimer--;
      push();
      // stroke(palette[4]);
      // strokeWeight(3);
      fill(palette[3]);
      textSize(100);
      textStyle(BOLD);
      textAlign(CENTER, CENTER);
      text("DEAD", width / 2, height / 2 - 100);

      fill(palette[0]);
      textSize(80);
      textAlign(CENTER, CENTER);
      text("Final Score: " + score, width / 2, height / 2 + 50);
      pop();

      if (overTimer < 0) {
        score = 0;
        overTimer = 100;
        updateFood();
        updateSnake();
        gameOver = false;
      }
    }
  }
}

/* This function moves the snake gradually. */
function moveSnake() {
  let deltaX = targetX - snakeX;
  let deltaY = targetY - snakeY;

  // create springing effect
  deltaX *= springing;
  deltaY *= springing;
  accelX += deltaX;
  accelY += deltaY;

  // move the snake's head
  snakeX += accelX;
  snakeY += accelY;

  // slow down springing
  accelX *= damping;
  accelY *= damping;
}

function updateFood() {
  foodX = random(foodImg.width / 2, width - foodImg.width / 2);
  foodY = random(foodImg.height / 2, height - foodImg.height / 2);
}

function updateSnake() {
  snakeX = width / 2;
  snakeY = height / 2;
}

/* To display the player's score. */
function showScore() {
  push();
  // score box
  // strokeWeight(3);
  // stroke(palette[2]);
  // let fc = color(palette[1]);
  // fc.setAlpha(33);
  // fill(fc);
  // rect(width - 160, 40, 120, 60, 10);

  // score text
  noStroke();
  fill(palette[0]);
  textSize(18);
  textStyle(BOLD);
  textAlign(CENTER, CENTER);
  text("SCORE", width - 100, 60);
  fill(palette[3]);
  text(score, width - 100, 85);
  pop();
}

/* Called once every time the browser window is resized. */
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
