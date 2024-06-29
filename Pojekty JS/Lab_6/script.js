const gameArea = document.getElementById("gameArea");
const ball = document.getElementById("ball");
const hole = document.getElementById("hole");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const recordsDisplay = document.getElementById("records");

let ballPosition = {
  x: Math.random() * (window.innerWidth - 30),
  y: Math.random() * (window.innerHeight - 30),
};
let holePosition = {
  x: Math.random() * (window.innerWidth - 50),
  y: Math.random() * (window.innerHeight - 50),
};
let score = 0; 
let startTime = Date.now(); 

function resetGame() {
  ballPosition = {
    x: Math.random() * (window.innerWidth - 30),
    y: Math.random() * (window.innerHeight - 30),
  };
  holePosition = {
    x: Math.random() * (window.innerWidth - 50),
    y: Math.random() * (window.innerHeight - 50),
  };
  ball.style.left = ballPosition.x + "px";
  ball.style.top = ballPosition.y + "px";
  hole.style.left = holePosition.x + "px";
  hole.style.top = holePosition.y + "px";
}

// Funkcja aktualizująca pozycję kulki
function updateBallPosition(x, y) {
  // Aktualizacja pozycji kulki
  ballPosition.x += x;
  ballPosition.y += y;

  // Ograniczenie pozycji kulki do obszaru widocznego ekranu
  ballPosition.x = Math.max(
    0,
    Math.min(window.innerWidth - 30, ballPosition.x)
  );
  ballPosition.y = Math.max(
    0,
    Math.min(window.innerHeight - 30, ballPosition.y)
  );

  ball.style.left = ballPosition.x + "px";
  ball.style.top = ballPosition.y + "px";

  if (
    ballPosition.x >= holePosition.x &&
    ballPosition.x <= holePosition.x + 50 &&
    ballPosition.y >= holePosition.y &&
    ballPosition.y <= holePosition.y + 50
  ) {
    score++; 
    scoreDisplay.textContent = score; 
    resetGame(); 
  }
}

function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
  timeDisplay.textContent = elapsedTime; 

  if (elapsedTime >= 60) {
    const recordItem = document.createElement("li");
    recordItem.textContent = score; 
    recordsDisplay.appendChild(recordItem);

    score = 0; 
    scoreDisplay.textContent = score; 
    startTime = Date.now(); 
  } else {
    requestAnimationFrame(updateTimer); 
  }
}

window.addEventListener("deviceorientation", (event) => {
  const { beta, gamma } = event; 
  updateBallPosition(gamma / 50, beta / 50); 
});

window.addEventListener("keydown", (event) => {
  const step = 5; // Wielkość kroku przesunięcia kulki
  switch (event.key) {
    case "ArrowUp":
      updateBallPosition(0, -step); 
      break;
    case "ArrowDown":
      updateBallPosition(0, step);
      break;
    case "ArrowLeft":
      updateBallPosition(-step, 0); 
      break;
    case "ArrowRight":
      updateBallPosition(step, 0); 
      break;
  }
});

// Inicjalizacja gry
resetGame();
updateTimer();
