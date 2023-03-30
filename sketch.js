const BG = 'rgb(225, 235, 235)';
const LIGHT_GREEN = 'rgb(142, 209, 33)';
const DARK_GREEN = 'rgb(66, 97, 16)';

const HANDLE_RADIUS_OUTER = 10;
const HANDLE_RADIUS_INNER = 5;
const TORUS_DETAIL_X = 10;
const TORUS_DETAIL_Y = 5;
const STICK_WIDTH = 10;
const STICK_HEIGHT = 50;
const STICK_HANDLE_OVERLAP = (HANDLE_RADIUS_OUTER - HANDLE_RADIUS_INNER) / 2;
const BLOWER_RADIUS_OUTER = HANDLE_RADIUS_OUTER * 2;
const BLOWER_CENTER_Y = STICK_HEIGHT + BLOWER_RADIUS_OUTER + HANDLE_RADIUS_OUTER;

let prevMouse;
let newMouse;
let audioAllowed;
let textureImg;
const sounds = [];
const bubbles = [];

function preload() {
  getAudioContext().suspend();
  soundFormats('mp3');
  for(let i = 1; i <= 4; i++) {
    sounds.push(loadSound(`pop${i}.mp3`));
  }
}

function setup() {
  document.addEventListener('touchmove', function(e) { e.preventDefault(); }, { passive:false });
  const HEIGHT = document.body.clientHeight;
  const WIDTH = document.body.clientWidth;
  prevMouse = [WIDTH / 2, HEIGHT / 2];
  createCanvas(WIDTH, HEIGHT, WEBGL);
  textureImg = loadImage('texture.png');
}

function getMouseX() {
  return -1 * document.body.clientWidth / 2 + mouseX;
}
function getMouseY() {
  return -1 * document.body.clientHeight / 2 + mouseY;
}

function addBubble() {
  bubbles.push(new Bubble(newMouse[0], newMouse[1] - BLOWER_CENTER_Y));
}

function draw() {
  newMouse = [getMouseX(), getMouseY()];
  background(BG);

  fill(LIGHT_GREEN);
  stroke(DARK_GREEN);
  strokeWeight(1);

  if (prevMouse != null) {
    push();
    // transform coordinate system to center of canvas
    translate(newMouse[0], newMouse[1]);
    push();
  }

  // draw bubble wand following cursor
  torus(HANDLE_RADIUS_OUTER, HANDLE_RADIUS_INNER, TORUS_DETAIL_X, TORUS_DETAIL_Y);
  translate(HANDLE_RADIUS_INNER - STICK_WIDTH / 2, HANDLE_RADIUS_OUTER - STICK_HEIGHT + STICK_HANDLE_OVERLAP);
  box(STICK_WIDTH, STICK_HEIGHT, 5);
  pop();
  translate(0, -1 * BLOWER_CENTER_Y);
  torus(BLOWER_RADIUS_OUTER, HANDLE_RADIUS_INNER, TORUS_DETAIL_X, TORUS_DETAIL_Y);
  pop();

  // slight debounce
  if (mouseIsPressed && frameCount % 3 === 0) {
    if (audioAllowed !== true) {
      getAudioContext().resume();
      audioAllowed = true;
    }
    addBubble()
  }

  noStroke();
  texture(textureImg);
  for (let i = bubbles.length - 1; i >= 0; i--) {
    let isDead = bubbles[i].frame();
    if (isDead) {
      bubbles.splice(i, 1);
    }
  }

  prevMouse = newMouse;
}