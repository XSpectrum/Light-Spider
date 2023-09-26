// create the canvas
const cv = document.createElement("canvas");
const cx = cv.getContext("2d");
document.body.appendChild(cv);

// init variables
const resolution = 1;
var cb = cv.getBoundingClientRect();
var cw = (cv.width = resolution * cb.width);
var ch = (cv.height = resolution * cb.height);

var mouseX = cw / 2;
var mouseY = ch / 2;

var ball_x = cw / 2;
var ball_y = ch / 2;

var velocity_x = 0.3;
var velocity_y = 0.3;

var paths = initPaths(0.1);
var currentPaths = getCurrentPaths();
var direction = getDirection();
var hasMove = false;


function rad(deg) {
  return (deg * Math.PI) / 180;
}

// distance between two points
function distance(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

function clearPartially() {
  cx.fillStyle = "#16161DAA";
  cx.fillRect(0, 0, cw, ch);
}

function clear() {
  cx.clearRect(0, 0, cw, ch);
}

// function to draw the ball (monster head)
function drawBall() {
  var r = 15;

  cx.beginPath();
  cx.arc(ball_x, ball_y, r, 0, rad(360));

  cx.save(); // Save canvas state
  cx.shadowBlur = 20;
  cx.shadowColor = "white";

  cx.fillStyle = "white";
  cx.fill();

  cx.shadowBlur = 40;
  cx.shadowColor = "#0FF";

  cx.fill();
  cx.restore();
  cx.closePath();

  cx.strokeStyle = "#fff7";
  cx.stroke();

  cx.closePath();
}

// draw on path point
function drawOnePath(x, y) {
  cx.beginPath();
  cx.arc(x, y, 2, 0, rad(360));

  cx.save();
  cx.shadowBlur = 5;
  cx.shadowColor = "white";

  cx.fillStyle = "white";
  cx.fill();

  cx.shadowBlur = 40;
  cx.shadowColor = "#FF0";

  cx.fill();
  cx.restore();
  cx.closePath();
}

// draw one feet from the head of monster to all points arround
function drawFeet(path) {
  cx.beginPath();
  var path0 = cx;

  let ctr1 = {};
  let ctr2 = {};

  // distance between ball and the current path point
  let d = distance(ball_x, ball_y, path.x, path.y);

  path0.moveTo(ball_x, ball_y);

  // create control points for the bezier curves according to the distance
  // between the ball and each path point
  ctr1 = {
    x: path.x - 100 > ball_x ? ball_x + 0.2 * d : ball_x - 0.2 * d,
    y: ball_y
  }

  ctr2 = {
    x: path.x - 100 > ball_x ? path.x - 0.5 * d : path.x + 0.5 * d,
    y: path.y > ball_y ? path.y - 0.1 * d : path.y + 0.1 * d,
  }

  // create the bezier curves
  path0.bezierCurveTo(ctr1.x, ctr1.y, ctr2.x, ctr2.y, path.x, path.y);

  cx.strokeStyle = "#fff7";
  cx.stroke();
  cx.closePath();
}

/* 
  initialize random points in the screen to constitute the paths where 
  the monster could walk
*/
function initPaths(density) {
  const points = new Set();  // use Set to avoid double allocation

  const nbPaths = Math.floor(density * (cw + ch) / 2);

  while (points.size < nbPaths) {
    const x = Math.random() * cw;
    const y = Math.random() * ch;

    // verify if the point is inside the table
    let pointExists = false;
    for (const existingPoint of points) {
      if (existingPoint[0] === x && existingPoint[1] === y) {
        pointExists = true;
        break;
      }
    }

    if (!pointExists) {
      points.add({
        x: x,
        y: y,
      });
    }
  }

  return Array.from(points);
}

// function to get all points arround the ball (monster head)
function getCurrentPaths() {
  const currentPaths = []

  paths.forEach((path) => {
    const distance = Math.sqrt((path.x - ball_x + 50) ** 2 + (path.y - ball_y) ** 2);

    if (distance <= 250) {
      currentPaths.push(path);
    }
  })

  // return [currentPaths[0]];
  return currentPaths;
}

// get mouse direction (not used yet)
function getDirection() {
  if (mouseX > ball_x) {
    return "right";
  } else {
    return "left";
  }
}

// main function
function main() {

  ball_x += (mouseX - ball_x) * velocity_x;
  ball_y += (mouseY - ball_y) * velocity_y;

  if (distance(ball_x, ball_y, mouseX, mouseY) < 20) {
    hasMove = false;
  }

  if (hasMove) clearPartially();
  else clear();

  // SECTION Draw ball
  drawBall()

  currentPaths.forEach((path) => {
    drawOnePath(path.x, path.y)
    drawFeet(path)
  })

  requestAnimationFrame(main); // main()
}

// listeners
window.addEventListener("resize", () => {
  cb = cv.getBoundingClientRect();
  cw = cv.width = resolution * cb.width;
  ch = cv.height = resolution * cb.height;
  paths = initPaths(10);
  currentPaths = getCurrentPaths();
});

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  hasMove = true;
  direction = getDirection();
  currentPaths = getCurrentPaths();
});

main();