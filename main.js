const cv = document.createElement("canvas");
const cx = cv.getContext("2d");
document.body.appendChild(cv);
const resolution = 1;
var cb = cv.getBoundingClientRect();
var cw = (cv.width = resolution * cb.width);
var ch = (cv.height = resolution * cb.height);

var mouseX = cw / 2;
var mouseY = ch / 2;

var ball_x = cw / 2;
var ball_y = ch / 2;

var velocity_x = 0.05;
var velocity_y = 0.05;

var hasMove = false;
// functions
function rad(deg) {
  return (deg * Math.PI) / 180;
}
function sin(deg) {
  return Math.sin(rad(deg));
}
function cos(deg) {
  return Math.cos(rad(deg));
}
function tan(deg) {
  return Math.tan(rad(deg));
}

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

function main() {
  var r = 10;

  ball_x += (mouseX - ball_x) * velocity_x;
  ball_y += (mouseY - ball_y) * velocity_y;

  if (distance(ball_x, ball_y, mouseX, mouseY) < 20) {
    hasMove = false;
  }

  if (hasMove) clearPartially();
  else clear();

  // SECTION Draw ball
  cx.beginPath();
  cx.arc(ball_x, ball_y, r, 0, rad(360));

  cx.save(); // sauvegarder l'état
  cx.shadowBlur = 10;
  cx.shadowColor = "white";

  cx.fillStyle = "white";
  cx.fill();

  cx.shadowBlur = 40;
  cx.shadowColor = "#0FF";

  cx.fill();
  cx.restore();
  cx.closePath();

  var feet_length = 300;

  var p4 = {
    x: cw / 2 - 150,
    y: ch / 2 - 50,
  };

  var p1 = {
    x: p4.x + 100,
    y: p4.y + 100,
  };

  var p2 = {
    x: p1.x + 150,
    y: p1.y + 50,
  };
  var p3 = {
    x: p2.x + 100,
    y: p2.y + 100,
  };

  var inflacted_length = distance(ball_x, ball_y, p4.x, p4.y);

  // SECTION Draw feet
  cx.beginPath();
  var path0 = cx;

  path0.moveTo(ball_x, ball_y);

  path0.quadraticCurveTo(p1.x, p1.y, p4.x, p4.y);

  //   path0.quadraticCurveTo(p3.x, p3.y, p4.x, p4.y);

  // cw=10
  // ch=10
  //     path0.moveTo(cw * 0.8, ch * 0.4);
  //   path0.quadraticCurveTo(
  //     cw * 0.7,
  //     ch * 0.2,
  //     cw * 0.6,
  //     ch * 0.4
  //   );
  //   path0.quadraticCurveTo(
  //     cw * 0.4965,
  //     ch * 0.6415,
  //     cw * 0.367,
  //     ch * 0.4
  //   );

  cx.strokeStyle = "#fff7";
  cx.stroke();

  cx.closePath();

  cx.beginPath();
  cx.arc(p4.x, p4.y, 3, 0, rad(360));

  cx.save(); // sauvegarder l'état
  cx.shadowBlur = 5;
  cx.shadowColor = "white";

  cx.fillStyle = "white";
  cx.fill();

  cx.shadowBlur = 40;
  cx.shadowColor = "#FF0";

  cx.fill();
  cx.restore();
  cx.closePath();

  requestAnimationFrame(main); // main()
}

// listeners
window.addEventListener("resize", () => {
  cb = cv.getBoundingClientRect();
  cw = cv.width = resolution * cb.width;
  ch = cv.height = resolution * cb.height;
});

window.addEventListener("mousemove", (e) => {
  //   console.log(e);
  mouseX = e.clientX;
  mouseY = e.clientY;
  hasMove = true;
});

main();
