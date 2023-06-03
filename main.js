const gameContainer = document.getElementById('game-container');
const gameTarget = document.getElementById('game-target');
const gameTimer = document.getElementById('game-timer');
const gameBestScore = document.getElementById('game-best-score');
const gameScore = document.getElementById('game-score');
const gameLives = document.getElementById('game-lives');
const gameDifficulty = document.getElementById('game-difficulty');
const startButton = document.getElementById('start-button');
const difficultyDescription = document.getElementById('difficulty-description');

const originalTargetWidth = gameTarget.offsetWidth;
const originalTargetHeight = gameTarget.offsetHeight;

const OPACITY_DECREASE_RATE = 0.5;
const TARGET_SIZE_MODIFIER = 0.9;
const MAX_LIVES = 3;

let selectedDifficulty = gameDifficulty.value;
let opacityIntervalID;
let difficultyTimer = 5;
let impossibleMode = false;
let bestScore = 0;
let opacity = 1;
let timerID;
let round = 0;
let timer = difficultyTimer;
let lives = MAX_LIVES;

gameTarget.disabled = true;
gameTarget.addEventListener('click', moveSquare);
startButton.addEventListener('click', startGame);

gameDifficulty.addEventListener('change', () => {
  const selectedOption = gameDifficulty.options[gameDifficulty.selectedIndex];
  const description = selectedOption.dataset.description;
  difficultyDescription.textContent = description;
  selectedDifficulty = gameDifficulty.value;

  impossibleMode = false;
  switch (selectedDifficulty) {
    default:
    case 'easy':
      difficultyTimer = 5;
      break;
    case 'medium':
      difficultyTimer = 4;
      break;
    case 'hard':
      difficultyTimer = 3;
      break;
    case 'impossible':
      impossibleMode = true;
      difficultyTimer = 3;
      break;
  }

  timer = difficultyTimer;
  gameTimer.textContent = timer;
});

function loseLife(event) {
  if (event.target === gameContainer) {
    lives--;
    if (lives <= 0) endGame();
    else if (lives > MAX_LIVES) lives = 3;
    gameLives.textContent = '❤️'.repeat(lives) + '🖤'.repeat(MAX_LIVES - lives);
  }
}

function decreaseOpacity() {
  opacity -= OPACITY_DECREASE_RATE;
  gameTarget.style.opacity = opacity;
  if (opacity <= 0) clearInterval(opacityIntervalID);
}

function resetOpacity() {
  opacity = 1;
  gameTarget.style.opacity = opacity;
  clearInterval(opacityIntervalID);
  opacityIntervalID = setInterval(decreaseOpacity, 100);
}

function endGame() {
  clearInterval(timerID);
  clearInterval(opacityIntervalID);
  startButton.disabled = false;
  gameTarget.disabled = true;
  gameDifficulty.disabled = false;
  gameTimer.textContent = difficultyTimer;
  gameTarget.style.opacity = 0.25;
  opacity = 1;

  if (round > bestScore) {
    bestScore = round;
    gameBestScore.textContent = bestScore;
  }

  gameContainer.removeEventListener('click', loseLife);
}

function updateTime() {
  timer--;
  gameTimer.textContent = timer;

  if (timer <= 0) endGame();
  else initiateTimerInterval();
}

function moveSquare() {
  const containerWidth = gameContainer.clientWidth;
  const containerHeight = gameContainer.clientHeight;
  const targetWidth = gameTarget.offsetWidth;
  const targetHeight = gameTarget.offsetHeight;
  const maxX = containerWidth - targetWidth;
  const maxY = containerHeight - targetHeight;
  const randomX = Math.floor(Math.random() * maxX);
  const randomY = Math.floor(Math.random() * maxY);

  const randomRotation = Math.floor(Math.random() * 360);
  const randomBorderRadius = Math.floor(Math.random() * 50);

  switch (selectedDifficulty) {
    case 'medium':
      gameTarget.style.borderRadius = `${randomBorderRadius}%`;
      break;
    case 'hard':
    case 'impossible':
      gameTarget.style.borderRadius = `${randomBorderRadius}%`;
      gameTarget.style.transform = `rotate(${randomRotation}deg)`;
      break;
    default:
      break;
  }

  gameTarget.style.width = `${targetWidth * TARGET_SIZE_MODIFIER}px`;
  gameTarget.style.height = `${targetHeight * TARGET_SIZE_MODIFIER}px`;
  gameTarget.style.top = `${randomY}px`;
  gameTarget.style.left = `${randomX}px`;

  round++;
  gameScore.textContent = round;

  timer = difficultyTimer + 1;
  updateTime();

  if (impossibleMode) resetOpacity();
}

function startGame() {
  gameTarget.disabled = false;
  round = 0;
  lives = MAX_LIVES;
  gameLives.textContent = '❤️❤️❤️';
  gameScore.textContent = 0;
  gameDifficulty.disabled = true;
  startButton.disabled = true;
  timer = difficultyTimer;
  initiateTimerInterval();

  gameTarget.style.opacity = 1;
  gameTarget.style.width = window.innerWidth >= 768 ? '400px' : '250px';
  gameTarget.style.height = gameTarget.style.width;
  gameTarget.style.top = '0px';
  gameTarget.style.left = '0px';
  gameTarget.style.transform = 'rotate(0deg)';
  gameTarget.style.borderRadius = '0.25em';

  gameContainer.addEventListener('click', loseLife);

  if (impossibleMode) {
    clearInterval(opacityIntervalID);
    opacityIntervalID = setInterval(decreaseOpacity, 100);
  }
}

function initiateTimerInterval() {
  clearInterval(timerID);
  timerID = setInterval(updateTime, 1000);
}
