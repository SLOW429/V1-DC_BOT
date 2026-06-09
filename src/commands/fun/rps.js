const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { playRps } = require("../../systems/gameSystem");

const labels = {
  rock: "🪨 Rock",
  paper: "📄 Paper",
  scissors: "✂️ Scissors"
};

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play enhanced rock paper scissors with multiplier rewards!")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Your choice")
        .setRequired(true)
        .addChoices(
          { name: "Rock", value: "rock" },
          { name: "Paper", value: "paper" },
          { name: "Scissors", value: "scissors" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet (optional)")
        .setMinValue(1)
        .setMaxValue(1000)
    ),
  async execute(interaction) {
    const choice = interaction.options.getString("choice", true);
    const bet = interaction.options.getNumber("bet") ?? 100;
    const game = playRps(choice);
    const resultKey = game.result === "win" ? "rpsWin" : game.result === "lose" ? "rpsLose" : "rpsDraw";
    
    const earnings = Math.floor(bet * game.multiplier);
    const resultEmoji = game.result === "win" ? "🎉" : game.result === "lose" ? "❌" : "🤝";

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: `${resultEmoji} ENHANCED ROCK PAPER SCISSORS`,
          description: [
            `You: **${labels[choice]}**`,
            `Bot: **${labels[game.botChoice]}**`,
            `\nResult: **${t(resultKey)}**`
          ].join("\n"),
          color: game.result === "win" ? colors.success : game.result === "lose" ? colors.danger : colors.warning,
          fields: [
            { name: "Bet Amount", value: `${bet}`, inline: true },
            { name: "Multiplier", value: `${game.multiplier}x`, inline: true },
            { name: "Earnings", value: `${earnings} coins`, inline: true }
          ]
        })
      ]
    });
  }
};
