'use strict';

// DOM elements
const wordElement = document.querySelector('.word');
const userInput = document.querySelector('.userInput');
const timeElement = document.querySelector('.time');
const scoreElement = document.querySelector('.score');
const startBtn = document.querySelector('.startBtn');
const restartBtn = document.querySelector('.restartBtn');
const scoreBtn = document.querySelector('.scoreBtn');
const gameEndContainer = document.querySelector('.gameEndContainer');
const backgroundMusic = document.querySelector('#backgroundMusic');
const correctSound = document.querySelector('#correctSound');
const resetBtn = document.querySelector('.resetBtn');
const modal = document.querySelector('#scoreModal');
const closeButton = document.querySelector('.close');
const timer = document.querySelector('.timer');
const seconds = document.querySelector('.seconds');
const gameElement = document.querySelector('.game');

let time = 15;
let score = 0;
let isPlaying = false;
let wordIndex;
let timerInterval; // Variable to store the interval ID

// Word list
const words = ['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population',
  'weather', 'bottle', 'history', 'dream', 'character', 'money', 'absolute',
  'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle',
  'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy',
  'database', 'periodic', 'capitalism', 'abominable', 'component', 'future',
  'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
  'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician',
  'professor', 'triangle', 'earthquake', 'baseball', 'beyond', 'evolution',
  'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
  'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button',
  'superman', 'library', 'unboxing', 'bookstore', 'language', 'homework',
  'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
  'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow',
  'keyboard', 'window'
];

// Initialize game
function init() {
  // Load background music
  backgroundMusic.play();

  // Show random word
  showWord();

  // Start countdown
  timerInterval = setInterval(updateTime, 1000); // Store the interval ID

  // Check input
  userInput.addEventListener('input', startMatch);

  // Restart game
  restartBtn.addEventListener('click', restartGame);
  resetBtn.addEventListener('click', resetGame);

  // Show score
  scoreBtn.addEventListener('click', showScore);
}

// Start game
function startGame() {
  if (!isPlaying) {
    isPlaying = true;
    startBtn.style.display = 'none';
    restartBtn.style.display = 'inline-block';
    time = 15;
    score = 0;
    scoreElement.textContent = score;
    showWord();
    userInput.style.display = 'block';
    userInput.value = '';
    userInput.focus();
    scoreElement.style.display = 'inline';

    // Initialize game
    init();

    gameElement.classList.add('active');
  }
}

// Reset game
function resetGame() {
  score = 0;
  scoreElement.textContent = score;
  time = 15;
  timeElement.textContent = time;
  userInput.value = '';
  showWord();
  // Reset game state
  isPlaying = false;
  clearInterval(timerInterval);
  pauseAndResetSound(backgroundMusic);
  pauseAndResetSound(correctSound);
  resetBtn.style.display = 'none'; // Hide the reset button when resetting the game
  gameEndContainer.style.display = 'none';
  startGame(); // Restart the game
}

// Pause and reset sound
function pauseAndResetSound(sound) {
  sound.pause();
  sound.currentTime = 0;
}

// Restart game
function restartGame() {
  isPlaying = false;
  startBtn.style.display = 'inline-block'; // Show the start button
  restartBtn.style.display = 'none'; // Hide the restart button
  gameEndContainer.style.display = 'none';
  userInput.style.display = 'none'; // Show the userInput element
  wordElement.style.display = 'block'; // Show the word element

  // Reset userInput value and style
  userInput.value = '';
  userInput.removeAttribute('disabled');
  userInput.focus();

  // Reset word element style
  wordElement.textContent = '';

  // Reset game variables
  clearInterval(timerInterval);
  time = 15;
  score = 0;
  scoreElement.textContent = score;
  timeElement.textContent = time;
  timeElement.style.color = ''; // Reset color to default
  gameElement.style.display = 'none';

  // Immediately redirect to the starting page without delay
  window.location.href = 'index.html';
}

// Game over
function gameOver() {
  isPlaying = false;
  startBtn.disabled = false;
  backgroundMusic.pause();
  startBtn.style.display = 'none';
  userInput.style.display = 'none';
  wordElement.style.display = 'none';
  gameEndContainer.style.display = 'block';
  resetBtn.style.display = 'none';
  timer.style.display = 'none';
  seconds.style.display = 'none';

  // Save score
  saveScore(score);
}

// Open modal
function openModal() {
  modal.style.display = 'block';
}

// Close modal
function closeModal() {
  modal.style.display = 'none';
}

// Close modal when clicking on close button
if (closeButton) {
  closeButton.addEventListener('click', closeModal);
}

// Show score
function showScore() {
  openModal();
  displayScoreboard();
}

// Display scoreboard
function displayScoreboard() {
  const scoreDetails = document.getElementById("scoreDetails");

  // Retrieve score data from local storage
  let scoreData = JSON.parse(localStorage.getItem('scores')) || [];

  // Sort scores by hits
  scoreData.sort((a, b) => b.hits - a.hits);

  // Display top scores
  scoreDetails.innerHTML = scoreData.slice(0, 9).map((score, index) => `
    <div class="score-details">
    <p>#${index + 1}</p>
    <p>${score.date}<p>
    <p>${score.hits.toString().padStart(3, ' ')} words</p>
    <p>${score.percentage}%</p>
    </div>
  `).join('');
}

// Save score
function saveScore(score) {
  // Retrieve score data from local storage
  let scoreData = JSON.parse(localStorage.getItem('scores')) || [];

  // Create score object
  const currentDate = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const day = currentDate.getDate().toString().padStart(2, '0'); // Ensure day is two digits with leading zero if necessary
  const formattedDate = `${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`;

  const percentage = ((score / words.length) * 100).toFixed(2);
  const newScore = { date: formattedDate, hits: score, percentage: percentage };

  // Add score to array
  scoreData.push(newScore);

  // Sort scores by hits
  scoreData.sort((a, b) => b.hits - a.hits);

  // Store only top 9 scores
  scoreData.splice(9);

  // Store score data in local storage
  localStorage.setItem('scores', JSON.stringify(scoreData));
}

// Show random word
function showWord() {
  let newIndex;
  do {
    newIndex = Math.floor(Math.random() * words.length);
  } while (newIndex === wordIndex);

  wordIndex = newIndex;
  wordElement.textContent = words[wordIndex];
  resetBtn.style.display = 'inline-block';
}

// Update time
function updateTime() {
  time--;
  timeElement.textContent = time;

  if (time === 15) {
    showWord();
  }

  if (time <= 10) {
    timeElement.style.color = '#ff0f0f'; // Change color to red for the last 10 seconds
    seconds.style.color = '#ff0f0f';
  } else {
    timeElement.style.color = ''; // Reset color to default
    seconds.style.color = '';
  }

  if (time === 0) {
    clearInterval(timerInterval); // Clear the interval to stop the timer
    timeElement.textContent = 'Game Over';
    gameOver();
  } else {
    timeElement.textContent = time;
  }
}

// Start match
function startMatch() {
  if (matchWords()) {
    isPlaying = true;
    score++;
    scoreElement.textContent = score;
    wordElement.style.color = '#fae128';
    wordElement.style.fontWeight = '600';

    correctSound.play();

    // Pause the sound after 1 second
    setTimeout(() => {
      correctSound.pause();
      correctSound.currentTime = 0; // Reset audio to the beginning
    }, 1000);

    setTimeout(() => {
      wordElement.style.color = ''; // Reset color after a delay (optional)
      showWord();
    }, 500); // Adjust delay as needed
    userInput.value = '';
  }
}

// Match words
function matchWords() {
  if (userInput.value.toLowerCase() === wordElement.textContent.toLowerCase()) {
    return true;
  } else {
    return false;
  }
}

// Start game when Start button is clicked
startBtn.addEventListener('click', startGame);
