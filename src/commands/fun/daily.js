<<<<<<< HEAD
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { claimDaily } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily 100 coins"),

  async execute(interaction) {
    try {
      const result = claimDaily(interaction.user.id);

      if (!result.success) {
        return interaction.reply({
          embeds: [errorEmbed("⏰ Not Yet!", result.message)],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          successEmbed("🎉 Daily Claimed!", `You received ${result.coins} coins! Come back tomorrow!`)
        ]
      });
    } catch (error) {
      logger.error("Daily command error", { error: error.message });
      return interaction.reply({
        embeds: [errorEmbed("Error", "Failed to claim daily reward")],
        ephemeral: true
      });
    }
  }
};
=======
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { claimDaily } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily 100 coins"),

  async execute(interaction) {
    try {
      const result = claimDaily(interaction.user.id);

      if (!result.success) {
        return interaction.reply({
          embeds: [errorEmbed("⏰ Not Yet!", result.message)],
          ephemeral: true
        });
      }

      return interaction.reply({
        embeds: [
          successEmbed("🎉 Daily Claimed!", `You received ${result.coins} coins! Come back tomorrow!`)
        ]
      });
    } catch (error) {
      logger.error("Daily command error", { error: error.message });
      return interaction.reply({
        embeds: [errorEmbed("Error", "Failed to claim daily reward")],
        ephemeral: true
      });
    }
  }
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
