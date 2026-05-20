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

function pickRandom(items) {
  return items[Math.floor(Math.random() * items.length)];
}

function flipCoin() {
  return Math.random() < 0.5 ? "heads" : "tails";
}

function rollDice(sides) {
  return Math.floor(Math.random() * sides) + 1;
}

function playRps(playerChoice) {
  const choices = ["rock", "paper", "scissors"];
  const botChoice = pickRandom(choices);

  if (playerChoice === botChoice) return { botChoice, result: "draw" };
  if (
    (playerChoice === "rock" && botChoice === "scissors") ||
    (playerChoice === "paper" && botChoice === "rock") ||
    (playerChoice === "scissors" && botChoice === "paper")
  ) {
    return { botChoice, result: "win" };
  }

  return { botChoice, result: "lose" };
}

function playSlots() {
  const symbols = ["7", "BAR", "STAR", "GEM", "BELL"];
  const result = [pickRandom(symbols), pickRandom(symbols), pickRandom(symbols)];
  const won = result.every((symbol) => symbol === result[0]);
  return { result, won };
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
  getTriviaQuestion
};
