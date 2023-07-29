let img, butterfly, image1, image2, image3;
let selectedColor = [255, 255, 255];
let selectedBrushColor = [0, 0, 0];
let brushSize = 10;
let paintingLayer;
let drawStars;

function preload() {
  img = loadImage("underwear.png");
  image1 = loadImage("image1.png");
  image2 = loadImage("image2.png");
  image3 = loadImage("image3.png");
  butterfly = loadImage("butterfly.png");
}

function setup() {
  paintingLayer = createGraphics(windowWidth, windowHeight);
  paintingLayer.clear();

  createCanvas(windowWidth, windowHeight);
  img.resize(img.width / 0.5, img.height / 0.5);

  createColorPickerUI();
  createBrushColorPickerUI();
  createBrushSizeSliderUI();
  textAlign(CENTER, BOTTOM);
}

function draw() {
  // create a copyCanvas of the image so we can modify the pixel values
  let copyCanvas = createImage(img.width, img.height);
  copyCanvas.copy(
    img,
    0,
    0,
    img.width,
    img.height,
    0,
    0,
    img.width,
    img.height
  );

  // get the red, green, and blue components of the selected color
  let r = selectedColor[0];
  let g = selectedColor[1];
  let b = selectedColor[2];

  // modify the pixel values of the copyCanvas to apply the selected color
  copyCanvas.loadPixels();
  for (let x = 0; x < copyCanvas.width; x++) {
    for (let y = 0; y < copyCanvas.height; y++) {
      let index = (x + y * copyCanvas.width) * 4;
      let pixelColor = copyCanvas.pixels.slice(index, index + 4);
      let avg = (pixelColor[0] + pixelColor[1] + pixelColor[2]) / 3;
      let newR = (r * avg) / 255;
      let newG = (g * avg) / 255;
      let newB = (b * avg) / 255;
      copyCanvas.pixels[index] = newR;
      copyCanvas.pixels[index + 1] = newG;
      copyCanvas.pixels[index + 2] = newB;
    }
  }
  copyCanvas.updatePixels();
  imageMode(CENTER);
  image(copyCanvas, windowWidth / 2, windowHeight / 2);
  textSize(12);
  text(
    "Hotkeys: A - Draw, S - Star, D - Sticker 1, F - Sticker 2, G - Sticker 3, H - Sitcker 4, Left Arrow - Reset",
    width / 2,
    height
  );
  
  imageMode(CENTER);
  image(paintingLayer,windowWidth/2, windowHeight /2);

  if (mouseIsPressed === true) {
    if (key == "a") {
      paintingLayer.stroke(selectedBrushColor);
      paintingLayer.strokeWeight(brushSize);
      paintingLayer.line(mouseX, mouseY, pmouseX, pmouseY);
    }
    if (key == "s") {
      paintingLayer.stroke(selectedBrushColor);
      paintingLayer.strokeWeight(brushSize);
      //paintingLayer.line(mouseX, mouseY, pmouseX, pmouseY);
      drawStar(mouseX, mouseY, 10, 6, 6);
    }
    if (key == "d") {
      paintingLayer.image(
        butterfly,
        mouseX,
        mouseY,
        brushSize * 10,
        brushSize * 10
      );
    }
    if (key == "f") {
      paintingLayer.image(
        image1,
        mouseX - 40,
        mouseY - 40,
        brushSize * 10,
        brushSize * 10
      );
    }
    if (key == "g") {
      paintingLayer.image(
        image2,
        mouseX - 40,
        mouseY - 40,
        brushSize * 10,
        brushSize * 10
      );
    }
    if (key == "h") {
      paintingLayer.image(
        image3,
        mouseX - 40,
        mouseY - 40,
        brushSize * 10,
        brushSize * 10
      );
    }
  }
  if (keyIsDown(LEFT_ARROW)) {
    console.log("test");
    paintingLayer.clear();
    background(255);
  }
}

function createColorPickerUI() {
  let colorPickerContainer = createDiv("Colour: ");
  colorPickerContainer.style("position", "absolute");
  colorPickerContainer.style("bottom", "10px");
  colorPickerContainer.style("left", "10px");
  colorPickerContainer.style("font-family", "Arial");
  colorPickerContainer.style("font-size", "18px");
  colorPickerContainer.style("font-weight", "bold");

  let colorPicker = createColorPicker("#FFFFFF");
  colorPicker.parent(colorPickerContainer);

  colorPicker.input(function () {
    selectedColor = colorPicker.color().levels;
  });
}

function createBrushColorPickerUI() {
  let colorBrushPickerContainer = createDiv("Brush Colour: ");
  colorBrushPickerContainer.style("position", "absolute");
  colorBrushPickerContainer.style("bottom", "40px");
  colorBrushPickerContainer.style("right", "10px");
  colorBrushPickerContainer.style("font-family", "Arial");
  colorBrushPickerContainer.style("font-size", "18px");
  colorBrushPickerContainer.style("font-weight", "bold");

  let colorBrushPicker = createColorPicker("#000000");
  colorBrushPicker.parent(colorBrushPickerContainer);

  colorBrushPicker.input(function () {
    selectedBrushColor = colorBrushPicker.color().levels;
  });
}

function createBrushSizeSliderUI() {
  let brushSizeContainer = createDiv("Brush Size:");
  brushSizeContainer.style("position", "absolute");
  brushSizeContainer.style("bottom", "10px");
  brushSizeContainer.style("right", "10px");
  brushSizeContainer.style("font-family", "Arial");
  brushSizeContainer.style("font-size", "18px");
  brushSizeContainer.style("font-weight", "bold");

  let brushSizeSlider = createSlider(1, 50, brushSize);
  brushSizeSlider.parent(brushSizeContainer);
  brushSizeSlider.style("width", "100px");
  brushSizeSlider.style("margin-left", "10px");

  brushSizeSlider.input(function () {
    brushSize = brushSizeSlider.value();
  });
}

function drawStar(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  paintingLayer.beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  paintingLayer.endShape(CLOSE);
}
