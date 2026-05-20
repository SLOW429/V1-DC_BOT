const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { playRps } = require("../../systems/gameSystem");

const labels = {
  rock: "Rock",
  paper: "Paper",
  scissors: "Scissors"
};

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("rps")
    .setDescription("Play rock paper scissors.")
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
    ),
  async execute(interaction) {
    const choice = interaction.options.getString("choice", true);
    const game = playRps(choice);
    const resultKey = game.result === "win" ? "rpsWin" : game.result === "lose" ? "rpsLose" : "rpsDraw";

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("gameResult"),
          description: [
            `You: **${labels[choice]}**`,
            `Bot: **${labels[game.botChoice]}**`,
            `Result: **${t(resultKey)}**`
          ].join("\n"),
          color: game.result === "win" ? colors.success : game.result === "lose" ? colors.danger : colors.warning
        })
      ]
    });
  }
};
