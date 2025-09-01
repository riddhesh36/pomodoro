// --- Setup input elements ---
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const workInput = document.getElementById("workInput");
const breakInput = document.getElementById("breakInput");
const next1 = document.getElementById("next1");
const next2 = document.getElementById("next2");
const mainDiv = document.querySelector('.mainDiv');
const progressBg = document.querySelector('.progressBg');
const timerEl = document.getElementById('timer');
const mainTitle = document.querySelector('.mainTitle');

// --- Initial values ---
let workDuration = 25 * 60;
let breakDuration = 5 * 60;
let countdown;
let timeLeft = workDuration;
let isRunning = false;
let isWorkSession = true;

// --- Handle setup flow ---
next1.addEventListener("click", () => {
  workDuration = parseInt(workInput.value) * 60 || 25 * 60;
  timeLeft = workDuration;
  step1.style.display = "none";
  step2.style.display = "block";
});

next2.addEventListener("click", () => {
  breakDuration = parseInt(breakInput.value) * 60 || 5 * 60;
  step2.style.display = "none";
  document.querySelector(".mainDiv").style.display = "block";
});

// --- Main logic (same as your current code) ---
mainDiv.addEventListener('click', () => {
  if (!isRunning && timeLeft === (isWorkSession ? workDuration : breakDuration)) {
    startSession();
  } else {
    if (isRunning) pauseTimer();
    else resumeTimer();
  }
});

function startSession() {
  timerEl.style.display = 'block';
  timerEl.style.position = 'relative';
  timerEl.style.color = 'white';
  mainTitle.style.display = 'none';
  timerEl.style.width = '60%';
  timerEl.style.fontSize = '2.5rem';
  timerEl.style.margin = '74% auto';
  timerEl.style.wordBreak = 'break-word';
  timerEl.style.textAlign = 'center';

  progressBg.style.backgroundColor = isWorkSession ? "#FF3B30" : "#F6DE16";
  progressBg.style.height = isWorkSession ? "100%" : "0%";
  progressBg.style.transition = "height 0.5s ease-out";

  setTimeout(() => {
    progressBg.style.transition = `height ${timeLeft}s linear`;
    progressBg.style.height = isWorkSession ? "0%" : "100%";
    startTimer();
  }, 500);
}

function startTimer() {
  isRunning = true;
  clearInterval(countdown);

  countdown = setInterval(() => {
    timeLeft--;
    let min = Math.floor(timeLeft / 60);
    let sec = timeLeft % 60;
    timerEl.textContent = `${min} ${sec < 10 ? "0" : ""}${sec}`;

    if (timeLeft <= 0) {
      clearInterval(countdown);
      isRunning = false;

      if (isWorkSession) {
        isWorkSession = false;
        timeLeft = breakDuration;
        timerEl.textContent = "Break";
        setTimeout(startSession, 1500);
      } else {
        isWorkSession = true;
        timeLeft = workDuration;
        timerEl.textContent = "Work?";
        setTimeout(startSession, 1500);
      }
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(countdown);
  let computedHeight = getComputedStyle(progressBg).height;
  progressBg.style.transition = "none";
  progressBg.style.height = computedHeight;
}

function resumeTimer() {
  isRunning = true;
  progressBg.style.transition = `height ${timeLeft}s linear`;
  progressBg.style.height = isWorkSession ? "0%" : "100%";
  startTimer();
}
