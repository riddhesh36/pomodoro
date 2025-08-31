const mainDiv = document.querySelector('.mainDiv');
const progressBg = document.querySelector('.progressBg');
const timerEl = document.getElementById('timer');
const mainTitle = document.querySelector('.mainTitle');

let workDuration = 25 * 60; // 25 mins
let breakDuration = 5 * 60; // 5 mins
let countdown;
let timeLeft = workDuration;
let isRunning = false; // track pause/play
let isWorkSession = true; // track work/break

mainDiv.addEventListener('click', () => {
  if (!isRunning && timeLeft === (isWorkSession ? workDuration : breakDuration)) {
    // First start of session
    startSession();
  } else {
    // Toggle pause/resume
    if (isRunning) {
      pauseTimer();
    } else {
      resumeTimer();
    }
  }
});

function startSession() {
  // Show timer UI
  timerEl.style.display = 'block';
  timerEl.style.position = 'relative';
  timerEl.style.color = 'white';
  mainTitle.style.display = 'none';
  timerEl.style.width = '60%';
  timerEl.style.fontSize = '2.5rem';
  timerEl.style.margin = '0 auto';
  timerEl.style.wordBreak = 'break-word';
  timerEl.style.textAlign = 'center';

  // Pick background color based on session type
  progressBg.style.backgroundColor = isWorkSession ? "#FF3B30" : "#F6DE16";

  // Set starting height & animation direction
  if (isWorkSession) {
    progressBg.style.height = "100%"; // work goes top → bottom
  } else {
    progressBg.style.height = "0%";   // break goes bottom → top
  }

  progressBg.style.transition = "height 0.5s ease-out";

  setTimeout(() => {
    // Animate shrink/grow based on timeLeft
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
        // Work finished → switch to break
        isWorkSession = false;
        timeLeft = breakDuration;
        timerEl.textContent = "Break Time!";
        setTimeout(startSession, 1500); // delay to show message
      } else {
        // Break finished → back to work
        isWorkSession = true;
        timeLeft = workDuration;
        timerEl.textContent = "Ready for Work?";
        setTimeout(startSession, 1500);
      }
    }
  }, 1000);
}

function pauseTimer() {
  isRunning = false;
  clearInterval(countdown);
  // Freeze progress bar
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
