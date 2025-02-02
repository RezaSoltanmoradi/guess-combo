// انتخاب المان‌ها برای نمایش رویداد ها
const guessContainer = document.getElementById("guessContainer"); // محیط بازی
const playerTxt = document.getElementById("player"); // نام بازیکن
const actionBtn = document.getElementById("actionBtn"); // دکمه شروع بازی
const feedback = document.getElementById("feedback"); // نمایش نتیجه لحظه ای حدس اعداد
const guessCountTxt = document.getElementById("guessCount"); // نمایش لحظه ای تعداد حدس ها
const timer = document.getElementById("timer"); // نمایش زمان باقی مانده برای انجام بازی
const record = document.getElementById("record"); // نمایش بهترین رکورد
const gameInputs = document.getElementById("gameInput"); // گرفتن تعداد اعداد ترکیبی
let gameIsStart = false; // برای شروع بازی
let playerName = ""; // نام بازیکن
let guessCount = 0; // تعداد حدس ها
let bestRecord; // بهترین رکورد
let secretCombo = []; // لیستی از اعداد رندم
let timeLeft = 60; // زمان بازی به ثانیه
let timeInterval; // شروع کننده زمان پایان
let gameInputsNumber = null; // تعداد اعداد ترکیبی بازی
// هندلر کلیک دکمه
actionBtn.addEventListener("click", () => {
  if (!gameIsStart) {
    if (invalidPlayerName(playerName)) {
      playerName = prompt(
        "لطفاً نام خود را برای شروع بازی وارد کنید!",
        ""
      ).trim();
      if (invalidPlayerName(playerName)) {
        playerTxt.innerHTML = "نام معتبر نیست❌";
        return;
      } else {
        playerTxt.innerHTML = playerName;
        gameInputs.style.display = "inline-block";
        actionBtn.textContent = "ثبت سختی بازی"; // تغییر متن دکمه
        return;
      }
    }
    // اگر هنوز تعداد ورودی‌ها تنظیم نشده باشد
    if (!gameInputsNumber) {
      gameInputsNumber = gameInputs.value;
      const validNumber = gameInputsNumber > 0 && gameInputsNumber <= 10;
      if (!validNumber) {
        alert("🚫 تعداد نامعتبر است! لطفاً عددی بین 1 تا 10 وارد کنید.");
        gameInputsNumber = null;
        return;
      }

      gameInputs.style.display = "none"; // مخفی کردن ورودی تعداد
      actionBtn.textContent = "شروع بازی 🎮"; // تغییر دکمه به "شروع بازی"
      return;
    }
    // شروع بازی جدید
    gameIsStart = true;
    guessCount = 0;
    guessCountTxt.textContent = `🎲 تعداد حدس‌ها: ${guessCount}`;
    feedback.textContent = "لطفاً اعداد خود را حدس بزنید❓";
    actionBtn.textContent = "بررسی اعداد🔍 ";
    updateBestRecord();
    generateSecretCombo(gameInputsNumber);
    createGuessInputs(gameInputsNumber);
    startTimer();
  } else {
    // بررسی حدس کاربر
    checkGuess();
  }
});

function updateBestRecord() {
  // دریافت رکورد از localStorage یا مقدار اولیه
  bestRecord = JSON.parse(localStorage.getItem("bestRecord")) || {
    guess: Infinity,
    time: Infinity,
    date: Infinity,
  };
  record.textContent = `🏆 بهترین رکورد: ${
    bestRecord.guess === Infinity
      ? "هنوز هیچ رکوردی ثبت نشده ❌"
      : `${bestRecord.guess} حدس در ${bestRecord.time} ثانیه  در ${bestRecord.date} توسط ${bestRecord.player}`
  } `;
}
updateBestRecord();

// تولید اعداد مخفی
function generateSecretCombo(number) {
  secretCombo = [];
  for (let i = 0; i < number; i++) {
    secretCombo.push(Math.floor(Math.random() * 10));
  }
}
// ایجاد ورودی‌های حدس
function createGuessInputs(number) {
  guessContainer.innerHTML = "";
  for (let i = 0; i < number; i++) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("input-wrapper");

    const input = document.createElement("input");
    input.setAttribute("type", "number");
    input.classList.add("input-digit");
    input.min = 0;
    input.max = 9;
    input.value = 0;
    input.dataset.index = i;

    const hint = document.createElement("span");
    hint.classList.add("hint");
    hint.textContent = "";

    wrapper.appendChild(input);
    wrapper.appendChild(hint);
    guessContainer.appendChild(wrapper);
  }
}

// شروع تایمر
function startTimer() {
  timeLeft = 60;
  timeInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    if (timeLeft <= 0) {
      feedback.textContent = "زمان به پایان رسید! بازی ریست می‌شود.";
      resetGame();
    }
  }, 1000);
}

// به‌روزرسانی نمایش تایمر
function updateTimerDisplay() {
  timer.textContent = `⏰ زمان باقی‌مانده: ${timeLeft} ثانیه`;
}

// ریست بازی (به جز رکورد)
function resetGame() {
  clearInterval(timeInterval);
  gameIsStart = false;
  playerName = "";
  guessCount = 0;
  gameInputs.value = 0;
  gameInputsNumber = null;
  actionBtn.textContent = "شروع بازی جدید 🎮";
  timer.textContent = `⏰ زمان باقی‌مانده: ${timeLeft} ثانیه`;
}

// بررسی حدس کاربر
function checkGuess() {
  console.log("secret numbers: ", secretCombo);
  const inputs = document.querySelectorAll(".input-digit");
  let correctCount = 0;
  inputs.forEach((input, index) => {
    const guess = parseInt(input.value, 10);
    if (input.value.trim() === "") {
      return;
    }
    const correctInputValue = secretCombo[index];
    const hint = input.nextElementSibling;
    if (guess === correctInputValue) {
      input.style.backgroundColor = "rgb(120,223,120)"; // سبز: درست
      hint.textContent = "✔️درست";
      correctCount++;
    } else {
      input.style.backgroundColor =
        guess < correctInputValue ? "skyblue" : "salmon";
      hint.textContent = guess < correctInputValue ? "🔺بالاتر" : "🔻پایین‌تر";
    }
  });

  guessCount++;
  guessCountTxt.textContent = `🎲 تعداد حدس‌ها: ${guessCount}`;

  if (correctCount === secretCombo.length) {
    let output = `تبریک!🎉 شما اعداد رو در ${guessCount} حدس حل کردید✔️`;
    if (
      guessCount < bestRecord.guess ||
      (guessCount == bestRecord.guess && bestRecord.time > 60 - timeLeft)
    ) {
      bestRecord = {
        guess: guessCount,
        time: 60 - timeLeft,
        date: getFormattedDate(),
        player: playerName,
      };
      console.log("bestRecord", bestRecord);
      localStorage.setItem("bestRecord", JSON.stringify(bestRecord));
      output += " رکورد جدید ثبت شد🏆";
    }
    feedback.textContent = output;
    updateBestRecord();
    resetGame();
  } else {
    feedback.textContent = "حدس شما اشتباه❌ است. دوباره تلاش کنید.";
  }
}

function invalidPlayerName(player) {
  const invalidName = typeof player === "string" ? !player.trim(" ") : !player;
  return invalidName;
}
function getFormattedDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1; // ماه‌ها از 0 شروع می‌شوند، پس +1 نیاز است
  const day = now.getDate();
  const hours = now.getHours();
  const minutes = now.getMinutes();

  return `تاریخ: ${year}/${month}/${day} - ساعت: ${hours}:${
    minutes < 10 ? "0" + minutes : minutes
  }`;
}
