console.log("Hello world");

const grid = document.querySelector(".grid");
let results = document.querySelector(".results");
let score = document.querySelector("#score");
let currentShooterIndex = 202;
let width = 15;
let direction = 1;
let goingRight = true;
let invadersId;
const aliensRemoved = [];

// Creating squares in the field area
for (let i = 0; i < width * width; i++) {
  const square = document.createElement("div");
  grid.appendChild(square);
  square.setAttribute("id", i);
}

// creating an array from the Node List Array containing the squares
const squares = Array.from(document.querySelectorAll(".grid div"));

// Alien Invaders
const alienInvaders = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 30, 31,
  32, 33, 34, 35, 36, 37, 38, 39,
];

// Inserting the aliens inside the squares
function draw() {
  for (let i = 0; i < alienInvaders.length; i++) {
    let invader = squares[alienInvaders[i]];
    let img = document.createElement("img");
    if (!aliensRemoved.includes(i)) {
      img.setAttribute("src", "./images/invader-retro.png");
      img.classList.add("invader__img");
      invader.classList.add("invader");
      invader.appendChild(img);
      // console.log(alienInvaders[i]);
    }
    if (alienInvaders[i] > squares.length - 1) {
      alienInvaders.splice(
        alienInvaders.indexOf(alienInvaders[i]),
        alienInvaders.length - 1
      );
    }
  }
}

draw();

// Remove the invaders
function removeInvader() {
  for (let i = 0; i < alienInvaders.length; i++) {
    let invader = squares[alienInvaders[i]];
    let img = invader.querySelector("img");
    if (img && !invader.classList.contains("shooter")) {
      invader.removeChild(img);
      invader.classList.remove("invader");
      img.classList.remove("invader__img");
    }
  }
}

function drawShooter() {
  const shooter = squares[currentShooterIndex];
  const img = document.createElement("img");

  img.setAttribute("src", "./images/shooter-retro.png");
  img.classList.add("shooter__img");

  shooter.appendChild(img);
  shooter.classList.add("shooter");
}

drawShooter();

function removeShooter() {
  const shooter = squares[currentShooterIndex];
  const img = shooter.querySelector("img");

  if (img) {
    shooter.removeChild(img);
    shooter.classList.remove("shooter");
  }
}

// Move Shooters
function moveShooter(e) {
  removeShooter();

  switch (e.key) {
    case "ArrowLeft":
      if (currentShooterIndex % width !== 0) currentShooterIndex--;
      break;
    case "ArrowRight":
      if (currentShooterIndex % width < width - 1) currentShooterIndex++;
      break;
  }
  drawShooter();
}

document.addEventListener("keydown", moveShooter);

// Move Invaders
function moveInvaders() {
  removeInvader();

  const leftEdge = alienInvaders[0] % width === 0;
  const rightEdge =
    alienInvaders[alienInvaders.length - 1] % width === width - 1;

  alienInvaders.forEach((invader, index, arr) => {
    arr[index] += direction;
  });

  // Move to the next row
  if (rightEdge && goingRight) {
    alienInvaders.forEach((invader, index, arr) => (arr[index] += width - 1));
    direction = -1;
    goingRight = false;
  }

  if (leftEdge && !goingRight) {
    alienInvaders.forEach((invader, index, arr) => (arr[index] += width + 1));
    direction = 1;
    goingRight = true;
  }

  draw();

  // If it hits the Shooter, GAME OVER
  if (squares[currentShooterIndex].classList.contains("invader", "shooter")) {
    document.removeEventListener("keydown", shoot);
    document.removeEventListener("keydown", moveShooter);
    score = null;
    results.innerHTML = "GAME OVER !!";
    removeShooter();
    clearInterval(invadersId);
  }

  // If any of invaders hit the bottom, GAME OVER
  for (
    let i = squares.indexOf(squares[squares.length - width]);
    i <= squares.indexOf(squares[squares.length - 1]) &&
    i >= squares.indexOf(squares[squares.length - width]);
    i++
  ) {
    if (squares[i].classList.contains("invader")) {
      document.removeEventListener("keydown", shoot);
      document.removeEventListener("keydown", moveShooter);
      score = null;
      results.innerHTML = "GAME OVER !!";
      clearInterval(invadersId);
    } else if (aliensRemoved.length === 30) {
      results.innerHTML = "YOU WIN !!";
      clearInterval(invadersId);
    }
  }
}

invadersId = setInterval(moveInvaders, 400);

function shoot(e) {
  let laserId;
  let currentLaserIndex = currentShooterIndex;
  function moveLaser() {
    squares[currentLaserIndex].classList.remove("laser");
    currentLaserIndex -= width;
    squares[currentLaserIndex].classList.add("laser");

    let invader = squares[currentLaserIndex];
    let img = invader.querySelector("img");

    // When laser hits invader
    if (squares[currentLaserIndex].classList.contains("invader")) {
      squares[currentLaserIndex].classList.remove("laser");
      squares[currentLaserIndex].classList.remove("invader");
      squares[currentLaserIndex].classList.add("boom");

      invader.removeChild(img);
      invader.classList.remove("invader");
      img.classList.remove("invader__img");

      setTimeout(
        () => squares[currentLaserIndex].classList.remove("boom"),
        300
      );
      const alienRemoved = alienInvaders.indexOf(currentLaserIndex);
      aliensRemoved.push(alienRemoved);
      score.innerHTML++;
      clearInterval(laserId);
    }

    // When laser hits the top
    if (currentLaserIndex - width < 0) {
      setInterval(() => {
        squares[currentLaserIndex].classList.remove("laser");
      }, 100);
      clearInterval(laserId);
    }
  }

  switch (e.key) {
    case "ArrowUp":
      laserId = setInterval(moveLaser, 100);
  }
}

document.addEventListener("keydown", shoot);
