/*
 *  Walking to pi!, on pi/2024 by @ajuancer (juancer.me)
 *
 *  Estimation of pi by measuring average distance from cycles
 *  of random 2D walks.
 *
 *  Inspired by math.stackexchange.com/q/103142,
 *  math.stackexchange.com/q/118889, and
 *  www.wired.com/2017/03/hey-can-find-pi-random-walk-heres/
 *
 *  Happy Pi day 2024!
 *
 */

// SETTINGS
let stepLength = 30; // graph distance beetween points
let stepIncrement = 5; // steps increment per cycle
let fr = 40; // frame rate



let totalSteps = 0; // steps to reach in each cycle
let stepCount = 0; // steps-counter of the cycle
let cycleCount = 1;
let startCycle = true;
let finalPosition = []; // last-position-per-cycle vectors
let distanceSqPerCycle = []; // distance(origin, last-position-of-cycle)^2
let stepsPerCycle = []; // number of steps of each cycle
let prevVector, currentVector, currentScreenVector, prevScreenVector, bestPi;

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Return a new vector randomly pointing
// up, down, right or left.
function randomVector() {
  r = random(1);
  if (r < 0.25) {
    return createVector(1, 0);
  } else if (r < 0.5) {
    return createVector(-1, 0);
  } else if (r < 0.75) {
    return createVector(0, 1);
  } else {
    return createVector(0, -1);
  }
}

// Calculate distance(origin, last-position-of-cycle)^2
function distanceSqFromOrigin(vf) {
  let o = createVector(width / 2, height / 2);
  return o.sub(vf).magSq();
}

function draw() {
  // Initialization of cycle
  if (startCycle) {
    background(22); // clean bkg

    // Plot all final positions
    for (let pos of finalPosition) {
      strokeWeight(25);
      stroke(200, 100, 80, 100);
      point(pos.x, pos.y);
    }

    // Plot starting point
    stroke(20, 100, 10);
    strokeWeight(25);
    point(width / 2, height / 2);

    prevVector = createVector(width / 2, height / 2);
    prevScreenVector = createVector(width / 2, height / 2);
    totalSteps += stepIncrement;

    startCycle = false;
  }

  // Plot text information
  strokeWeight(0);
  fill(22);
  rect(10, 5, 300, 120);
  textSize(20);
  fill(255, 150, 200);
  text(`Cycle ${cycleCount}`, 30, 30);
  text(`Step ${stepCount}/${totalSteps}`, 30, 60);
  let pi = 4 * slopeFromLinearRegression(distanceSqPerCycle, stepsPerCycle);
  pi = round(pi, 4);
  bestPi = bestPiApprox(bestPi, pi);
  text(`Pi value approx: ${pi}`, 30, 90);
  textSize(16);
  text(`best so far: ${bestPi}`, 40, 110);

  // Create the step vector
  let rv = randomVector();
  currentVector = rv.copy().add(prevVector);
  currentScreenVector = rv.copy().mult(stepLength).add(prevScreenVector);

  if (stepCount < totalSteps) {
    // Is not last step of cycle: small yellow point
    strokeWeight(15);
    stroke(150, 150, 10, 150);
  } else {
    // Is last step of cycle: big red point
    strokeWeight(25);
    stroke(200, 100, 80);
  }
  point(currentScreenVector.x, currentScreenVector.y);

  // Plot line connecting previous with current step
  stroke(255, 100);
  strokeWeight(6);
  line(
    prevScreenVector.x,
    prevScreenVector.y,
    currentScreenVector.x,
    currentScreenVector.y
  );

  if (stepCount == totalSteps) {
    // In last step of the cycle
    finalPosition.push(currentScreenVector);

    d = distanceSqFromOrigin(currentVector);
    distanceSqPerCycle.push(d);
    stepsPerCycle.push(stepCount);

    stepCount = 0;
    cycleCount += 1;
    startCycle = true;
  }

  frameRate(fr);

  prevVector = currentVector;
  prevScreenVector = currentScreenVector;
  stepCount += 1;
}

// Calculate the slope of a lineal regression model.
function slopeFromLinearRegression(y, x) {
  const n = y.length;
  let sx = 0;
  let sy = 0;
  let sxy = 0;
  let sxx = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sx += x[i];
    sy += y[i];
    sxy += x[i] * y[i];
    sxx += x[i] * x[i];
    syy += y[i] * y[i];
  }
  const mx = sx / n;
  const my = sy / n;
  const yy = n * syy - sy * sy;
  const xx = n * sxx - sx * sx;
  const xy = n * sxy - sx * sy;
  return xy / xx;
}

// Return the closest number to Pi
function bestPiApprox(x, y) {
  let distanceX = abs(x-PI);
  let distanceY = abs(y-PI);
  
  if (distanceX < distanceY) {
    return x;
  } else {
    return y;
  }
}
