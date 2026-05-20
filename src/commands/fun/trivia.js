const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { getTriviaQuestion } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("trivia")
    .setDescription("Get a quick trivia question."),
  async execute(interaction) {
    const trivia = getTriviaQuestion();

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("triviaTitle"),
          description: trivia.question,
          color: colors.primary
        }).addFields({
          name: t("triviaAnswer"),
          value: `||${trivia.answer}||`,
          inline: false
        })
      ]
    });
  }
};
