let xpos, ypos; // Starting position of shape
//var img;
let xspeed = 2.8; // Speed of the shape
let yspeed = 2.2; // Speed of the shape

let xdirection = 1; // Left or Right
let ydirection = 1; // Top to Bottom
let img;
function preload() {
  img = loadImage('https://i.ibb.co/Mk2Jt03/Turtle-Icon-Red.png');
}
function windowResized() {
  canvas.resize(windowWidth, windowHeight)
}
function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0)
  canvas.style("z-index: -1")
 // img = createImg("https://i.ibb.co/Mk2Jt03/Turtle-Icon-Red.png", "")
  xpos = width/2
  ypos = height/2
  image(img, 100, 100, 100, 100)
 // img.position(width/2, height/2)
}

function draw() {
  background("#212529");

  // Update the position of the shape
  xpos = xpos + xspeed * xdirection;
  ypos = ypos + yspeed * ydirection;

  // Test to see if the shape exceeds the boundaries of the screen
  // If it does, reverse its direction by multiplying by -1
  if (xpos > width - 100 || xpos < 0) {
    xdirection *= -1;

  }
  if (ypos > height - 100 || ypos < 0) {
    ydirection *= -1;
  }

  // Draw the shape
  image(img, xpos, ypos, 100, 100);
}
