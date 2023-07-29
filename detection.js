let detections = {};

const pose = new Pose({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
  },
});

pose.setOptions({
  modelComplexity: 1,
  smoothLandmarks: true,
  enableSegmentation: false,
  smoothSegmentation: false,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5,
});

pose.onResults(onResults);

function onResults(results) {
  if (!results.poseLandmarks) {
    return;
  }
  detections = results;
}

function update() {
  window.requestAnimationFrame(send);
}

async function send() {
  await pose.send({ image: cam.elt }).then(function () {
    update();
  });
}

function drawLandmarks(indexArray) {
  strokeWeight(2)
  for (let i = 0; i < detections.poseLandmarks.length; i++) {
    let x = detections.poseLandmarks[i].x * width;
    let y = detections.poseLandmarks[i].y * height;
    noFill();
    stroke(255, 0, 0);
    ellipse(x, y, 10, 10);
    noStroke();
    fill(0, 255, 0);
    text(i, x + 6, y);
  }
}

function drawConnectors(index, indexArray) {
  strokeWeight(3);
  stroke(255, 100, 0);
  for (let i = 0; i < detections.poseLandmarks.length; i++) {
    let a = indexArray[i];
    let x = detections.poseLandmarks[a[0]].x * width;
    let y = detections.poseLandmarks[a[0]].y * height;
    let _x = detections.poseLandmarks[a[1]].x * width;
    let _y = detections.poseLandmarks[a[1]].y * height;
    line(x, y, _x, _y);
  }
}

function drawLines() {
  stroke(0, 0, 255);
  strokeWeight(3);
  for (let i = 0; i < detections.poseLandmarks.length - 1; i++) {
    let x = detections.poseLandmarks[i].x * width;
    let y = detections.poseLandmarks[i].y * height;
    // let z = detections.poseLandmarks[i].z;

    let _x = detections.poseLandmarks[i + 1].x * width;
    let _y = detections.poseLandmarks[i + 1].y * height;
    // let _z = detections.multiHandLandmarks[i][index[j+1]].z;
    line(x, y, _x, _y);
  }
}

function getBodyPose() {
  let leftArm = [];
  let rightArm = [];
  let leftLeg = [];
  let rightLeg = [];
  let head;
  let body;
  let bd = detections.poseLandmarks;
  for (let i = 0; i < BODY.leftArm.length - 1; i++) {
    let id0 = BODY.leftArm[i];
    let id1 = BODY.leftArm[i + 1];
    let bx = bd[id0].x * width;
    let by = bd[id0].y * height;
    let bx1 = bd[id1].x * width;
    let by1 = bd[id1].y * height;
    let d = dist(bx, by, bx1, by1);
    let a = atan2(by1 - by, bx1 - bx);
    leftArm[i] = { x: bx, y: by, angle: a, size: d };
  }
  for (let i = 0; i < BODY.rightArm.length - 1; i++) {
    let id0 = BODY.rightArm[i];
    let id1 = BODY.rightArm[i + 1];
    let bx = bd[id0].x * width;
    let by = bd[id0].y * height;
    let bx1 = bd[id1].x * width;
    let by1 = bd[id1].y * height;

    let d = dist(bx, by, bx1, by1);
    let a = atan2(by1 - by, bx1 - bx);
    rightArm[i] = { x: bx, y: by, angle: a, size: d };
  }
  for (let i = 0; i < BODY.leftLeg.length - 1; i++) {
    let id0 = BODY.leftLeg[i];
    let id1 = BODY.leftLeg[i + 1];
    let bx = bd[id0].x * width;
    let by = bd[id0].y * height;
    let bx1 = bd[id1].x * width;
    let by1 = bd[id1].y * height;

    let d = dist(bx, by, bx1, by1);
    let a = atan2(by1 - by, bx1 - bx);
    leftLeg[i] = { x: bx, y: by, angle: a, size: d };
  }
  for (let i = 0; i < BODY.rightLeg.length - 1; i++) {
    let id0 = BODY.rightLeg[i];
    let id1 = BODY.rightLeg[i + 1];
    let bx = bd[id0].x * width;
    let by = bd[id0].y * height;
    let bx1 = bd[id1].x * width;
    let by1 = bd[id1].y * height;

    let d = dist(bx, by, bx1, by1);
    let a = atan2(by1 - by, bx1 - bx);
    rightLeg[i] = { x: bx, y: by, angle: a, size: d };
  }
  {
    let bx = bd[BODY.head[0]].x * width;
    let by = bd[BODY.head[0]].y * height;
    let bx1 = bd[BODY.head[1]].x * width;
    let by1 = bd[BODY.head[1]].y * height;
    let d = dist(bx, by, bx1, by1);
    let a = atan2(by1 - by, bx1 - bx);
    head = { x: bx, y: by - d/2, angle: a, width: d, height: d * 1.4 };
  }
  {
    let bx = bd[BODY.body[0]].x * width;
    let by = bd[BODY.body[0]].y * height;
    let bx1 = bd[BODY.body[1]].x * width;
    let by1 = bd[BODY.body[1]].y * height;
    let d = dist(bx, by, bx1, by1);
    let cx = (bx + bx1)/2;
    let cy = (by + by1)/2;
    let cx1 = width * (bd[24].x + bd[23].x)/2;
    let cy1 = height * (bd[24].y + bd[23].y)/2;
    let h = dist(cx, cy, cx1, cy1);
    let a = atan2(by1 - by, bx1 - bx);
    body = { x: bx, y: by, angle: a, width: d, height: h };
  }
  return { 
    "body":body,"head":head,"leftArm":leftArm,"rightArm":rightArm,
    "leftLeg":leftLeg,"rightLeg":rightLeg
  }
}

const BODY = {
  leftArm: [11, 13, 15, 19],
  leftLeg: [23, 25, 27, 31],
  rightArm: [12, 14, 16, 20],
  rightLeg: [24, 26, 28, 32],
  body: [12, 11],
  head: [8, 7],
};
// const camera = new Camera(videoElement, {
//   onFrame: async () => {
//     await pose.send({ image: cam.elt });
//   },
//   width: 640,
//   height: 480,
// });

// console.log(camera);
