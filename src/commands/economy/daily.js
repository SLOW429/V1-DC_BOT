const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { claimDaily } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins reward | اجمع مكافأة اليوم"),

  async execute(interaction) {
    const result = claimDaily(interaction.user.id);

    if (!result.success) {
      return interaction.reply({
        embeds: [errorEmbed(t("dailyTitle"), t("dailyAlreadyMessage"))],
        ephemeral: true
      });
    }

    return interaction.reply({
      embeds: [successEmbed(t("dailyTitle"), t("dailySuccessMessage", result.coins))]
    });
  }
};