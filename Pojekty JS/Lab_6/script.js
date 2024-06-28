// Pobieranie referencji do elementów DOM
const gameArea = document.getElementById("gameArea");
const ball = document.getElementById("ball");
const hole = document.getElementById("hole");
const timeDisplay = document.getElementById("time");
const scoreDisplay = document.getElementById("score");
const recordsDisplay = document.getElementById("records");

// Inicjalizacja pozycji kulki i dziury na losowych pozycjach
let ballPosition = {
  x: Math.random() * (window.innerWidth - 30),
  y: Math.random() * (window.innerHeight - 30),
};
let holePosition = {
  x: Math.random() * (window.innerWidth - 50),
  y: Math.random() * (window.innerHeight - 50),
};
let score = 0; // Początkowy wynik
let startTime = Date.now(); // Czas rozpoczęcia gry

// Funkcja resetująca pozycje kulki i dziury na losowe pozycje
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

  // Aktualizacja stylów pozycji kulki w DOM
  ball.style.left = ballPosition.x + "px";
  ball.style.top = ballPosition.y + "px";

  // Sprawdzenie, czy kulka znajduje się w dziurze
  if (
    ballPosition.x >= holePosition.x &&
    ballPosition.x <= holePosition.x + 50 &&
    ballPosition.y >= holePosition.y &&
    ballPosition.y <= holePosition.y + 50
  ) {
    score++; // Zwiększenie wyniku
    scoreDisplay.textContent = score; // Aktualizacja wyświetlania wyniku
    resetGame(); // Resetowanie pozycji kulki i dziury
  }
}

// Funkcja aktualizująca czas gry i zapisująca wynik po upływie minuty
function updateTimer() {
  const elapsedTime = Math.floor((Date.now() - startTime) / 1000); // Obliczenie upływu czasu w sekundach
  timeDisplay.textContent = elapsedTime; // Aktualizacja wyświetlania czasu

  if (elapsedTime >= 60) {
    // Po upływie minuty zapisanie wyniku i resetowanie gry
    const recordItem = document.createElement("li");
    recordItem.textContent = score; // Dodanie wyniku do listy rekordów
    recordsDisplay.appendChild(recordItem);

    score = 0; // Resetowanie wyniku
    scoreDisplay.textContent = score; // Aktualizacja wyświetlania wyniku
    startTime = Date.now(); // Restartowanie czasu gry
  } else {
    requestAnimationFrame(updateTimer); // Kontynuowanie aktualizacji czasu
  }
}

// Obsługa zdarzenia orientacji urządzenia mobilnego
window.addEventListener("deviceorientation", (event) => {
  const { beta, gamma } = event; // Pobranie wartości beta i gamma z akcelerometru
  updateBallPosition(gamma / 50, beta / 50); // Aktualizacja pozycji kulki
});

// Dodanie obsługi klawiatury dla symulacji ruchu kulki
window.addEventListener("keydown", (event) => {
  const step = 5; // Wielkość kroku przesunięcia kulki
  switch (event.key) {
    case "ArrowUp":
      updateBallPosition(0, -step); // Przesunięcie kulki w górę
      break;
    case "ArrowDown":
      updateBallPosition(0, step); // Przesunięcie kulki w dół
      break;
    case "ArrowLeft":
      updateBallPosition(-step, 0); // Przesunięcie kulki w lewo
      break;
    case "ArrowRight":
      updateBallPosition(step, 0); // Przesunięcie kulki w prawo
      break;
  }
});

// Inicjalizacja gry
resetGame();
updateTimer();