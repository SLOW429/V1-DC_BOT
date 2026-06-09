const { SlashCommandBuilder } = require("discord.js");
const config = require("../../config");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { getEightBallAnswer } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask the magic 8 ball a question.")
    .addStringOption((option) =>
      option.setName("question").setDescription("Your question").setRequired(true)
    ),
  async execute(interaction) {
    const question = interaction.options.getString("question", true);
    const answer = getEightBallAnswer(config.language);

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("eightBallTitle"),
          color: colors.primary
        }).addFields(
          { name: t("eightBallQuestion"), value: question, inline: false },
          { name: t("eightBallAnswer"), value: answer, inline: false }
        )
      ]
    });
  }
};
