const { SlashCommandBuilder } = require("discord.js");
const { successEmbed } = require("../../utils/embedBuilder");
const { work } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 1800,
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work to earn coins | اعمل لكسب العملات"),

  async execute(interaction) {
    const result = work(interaction.user.id);
    return interaction.reply({
      embeds: [
        successEmbed(t("workTitle"), t("workSuccessMessage", result.coins))
      ]
    });
  }
};