const MIN_BUBBLE_SIZE = 20;
const MAX_BUBBLE_SIZE = 100;
const BUBBLE_JITTER = 50;
const MIN_LIFESPAN = 100;
const MAX_LIFESPAN = 500;

class Bubble {
  constructor(x, y) {
    this.x = random(x - BUBBLE_JITTER / 2, x + BUBBLE_JITTER / 2);
    this.y = random(y - BUBBLE_JITTER / 2, y + BUBBLE_JITTER / 2);
    this.d = random(MIN_BUBBLE_SIZE, MAX_BUBBLE_SIZE);
    this.vx = random(-1, 1);
    this.vy = random(-1, 1);
    this.vz = random(-0.2, 0.2);
    this.lifespan = Math.floor(random(MIN_LIFESPAN, MAX_LIFESPAN));
    this.sound = sounds[Math.floor(random(0, sounds.length))];
  }

  draw() {
    circle(this.x, this.y, this.d);
  }

  move() {
    this.x += this.vx;
    this.y += this.vy;
    this.d = max(MIN_BUBBLE_SIZE, min(this.d + this.vz, MAX_BUBBLE_SIZE));
  }

  boundsCheck() {
    const WIDTH = document.body.clientWidth / 2;
    const HEIGHT = document.body.clientHeight / 2;
    const leftBound = this.x < -1 * WIDTH + this.d / 2;
    const rightBound = this.x > WIDTH - this.d / 2;
    const topBound = this.y < -1 * HEIGHT + this.d / 2;
    const bottomBound = this.y > HEIGHT - this.d / 2;
    if (leftBound || rightBound || topBound || bottomBound) {
      this.lifespan = 0;
    }
  }

  onPop() {
    this.sound.play();
  }

  frame() {
    this.draw();
    this.move();
    this.boundsCheck();
    this.lifespan -= 1;
    if (this.lifespan < 0) {
      this.onPop();
      return true;
    }
    return false;
  }
}