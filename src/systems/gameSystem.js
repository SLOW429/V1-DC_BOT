const eightBallAnswers = {
  en: [
    "Absolutely.",
    "Maybe.",
    "Not today.",
    "Ask again later.",
    "The odds look good.",
    "I would not count on it."
  ],
  ar: [
    "اكيد.",
    "ممكن.",
    "ليس اليوم.",
    "اسأل مرة اخرى لاحقا.",
    "الفرصة تبدو جيدة.",
    "لا تعتمد على ذلك كثيرا."
  ]
};

const triviaQuestions = [
  {
    question: "What does CPU stand for?",
    answer: "Central Processing Unit"
  },
  {
    question: "What is the maximum number of members in a standard Discord group DM?",
    answer: "10"
  },
  {
    question: "Which planet is known as the Red Planet?",
    answer: "Mars"
  },
  {
    question: "ما عاصمة مصر؟",
    answer: "القاهرة"
  },
  {
    question: "ما اسم العملة الرسمية في تركيا؟",
    answer: "الليرة التركية"
  }
];

<<<<<<< HEAD
const crypto = require("crypto");

function randomInt(max) {
  return crypto.randomInt(max);
}

function pickRandom(items) {
  return items[randomInt(items.length)];
}

function flipCoin() {
  return randomInt(2) === 0 ? "heads" : "tails";
}

function rollDice(sides) {
  return randomInt(sides) + 1;
=======
function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function flipCoin() {
  return Math.random() < 0.5 ? "heads" : "tails";
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
}

// Enhanced RPS with multiplier rewards
function playRps(playerChoice) {
  const choices = ["rock", "paper", "scissors"];
  const botChoice = pickRandom(choices);

  if (playerChoice === botChoice) return { botChoice, result: "draw", multiplier: 1 };
  if (
    (playerChoice === "rock" && botChoice === "scissors") ||
    (playerChoice === "paper" && botChoice === "rock") ||
    (playerChoice === "scissors" && botChoice === "paper")
  ) {
    return { botChoice, result: "win", multiplier: 2 };
  }

  return { botChoice, result: "lose", multiplier: 0.5 };
}

// Enhanced slots with better odds and multipliers
function playSlots() {
  const symbols = ["🍒", "🍋", "🍊", "🎰", "👑", "💎", "⭐", "🔔"];
  const result = [pickRandom(symbols), pickRandom(symbols), pickRandom(symbols)];
<<<<<<< HEAD

  const allMatch = result.every((symbol) => symbol === result[0]);
  const twoMatch = result[0] === result[1] || result[1] === result[2];

  let multiplier = 1;
  if (allMatch) {
    multiplier = 10;
  } else if (twoMatch) {
    multiplier = 3;
  }

=======
  
  const allMatch = result.every((symbol) => symbol === result[0]);
  const twoMatch = (result[0] === result[1]) || (result[1] === result[2]);
  
  let multiplier = 1;
  if (allMatch) {
    multiplier = 10; // All three match = 10x
  } else if (twoMatch) {
    multiplier = 3; // Two match = 3x
  }
  
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  return { result, won: allMatch, multiplier, twoMatch };
}

// New: Enhanced dice roller with bonus
function advancedDiceRoll(numDice = 1, sides = 6) {
  const rolls = [];
  let total = 0;
<<<<<<< HEAD

  for (let i = 0; i < numDice; i++) {
    const roll = randomInt(sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  const bonus = total >= sides * numDice * 0.7 ? Math.floor(total * 0.2) : 0;
=======
  
  for (let i = 0; i < numDice; i++) {
    const roll = Math.floor(Math.random() * sides) + 1;
    rolls.push(roll);
    total += roll;
  }
  
  const bonus = total >= (sides * numDice * 0.7) ? Math.floor(total * 0.2) : 0;
  
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  return { rolls, total, bonus, finalTotal: total + bonus };
}

// New: Coin flip with multiplier
function advancedCoinFlip() {
<<<<<<< HEAD
  const flip = randomInt(2) === 0 ? "heads" : "tails";
  const multiplier = randomInt(100) < 10 ? 5 : 2;
=======
  const flip = Math.random() < 0.5 ? "heads" : "tails";
  const multiplier = Math.random() < 0.1 ? 5 : 2; // 10% chance for 5x
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  return { flip, multiplier };
}

// New: Lucky spin game
function playLuckySpin() {
  const spins = ["🎯", "💰", "🎁", "✨", "🏆"];
  const result = pickRandom(spins);
<<<<<<< HEAD

=======
  
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  const rewards = {
    "🎯": { multiplier: 1.5, message: "You hit the target! 🎯" },
    "💰": { multiplier: 3, message: "Cash jackpot! 💰" },
    "🎁": { multiplier: 2, message: "Mystery gift! 🎁" },
    "✨": { multiplier: 2.5, message: "Lucky magic! ✨" },
    "🏆": { multiplier: 5, message: "Grand prize! 🏆" }
  };
<<<<<<< HEAD

=======
  
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  return { result, ...rewards[result] };
}

// New: Number guessing game with rewards
function numberGuessingGame() {
<<<<<<< HEAD
  const secretNumber = randomInt(100) + 1;
  const winReward = randomInt(51) + 50;

  return {
    secretNumber,
=======
  const secretNumber = Math.floor(Math.random() * 100) + 1;
  const winReward = Math.floor(Math.random() * 100) + 50;
  
  return { 
    secretNumber, 
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
    winReward,
    minRange: 1,
    maxRange: 100
  };
}

function getEightBallAnswer(language) {
  return pickRandom(eightBallAnswers[language] || eightBallAnswers.en);
}

function getTriviaQuestion() {
  return pickRandom(triviaQuestions);
}

module.exports = {
  flipCoin,
  rollDice,
  playRps,
  playSlots,
  getEightBallAnswer,
  getTriviaQuestion,
  advancedDiceRoll,
  advancedCoinFlip,
  playLuckySpin,
  numberGuessingGame
};
