<<<<<<< HEAD
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { claimDaily, getBalance, getTopBalances } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your coin balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("Check another user's balance").setRequired(false)
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser("user") || interaction.user;
      const balance = getBalance(targetUser.id);

      if (!balance) {
        return interaction.reply({
          embeds: [errorEmbed("Error", "Could not retrieve balance")],
          ephemeral: true
        });
      }

      const embed = baseEmbed({
        title: `💰 ${targetUser.username}'s Balance`,
        color: colors.success
      });

      embed.addFields(
        { name: "💵 Coins", value: `${balance.coins}`, inline: true },
        { name: "📅 Daily Claim", value: balance.daily_claimed ? "Claimed today" : "Available", inline: true }
      );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Balance command error", { error: error.message });
      return interaction.reply({
        embeds: [errorEmbed("Error", "Failed to get balance")],
        ephemeral: true
      });
    }
  }
};
=======
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { claimDaily, getBalance, getTopBalances } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your coin balance")
    .addUserOption((option) =>
      option.setName("user").setDescription("Check another user's balance").setRequired(false)
    ),

  async execute(interaction) {
    try {
      const targetUser = interaction.options.getUser("user") || interaction.user;
      const balance = getBalance(targetUser.id);

      if (!balance) {
        return interaction.reply({
          embeds: [errorEmbed("Error", "Could not retrieve balance")],
          ephemeral: true
        });
      }

      const embed = baseEmbed({
        title: `💰 ${targetUser.username}'s Balance`,
        color: colors.success
      });

      embed.addFields(
        { name: "💵 Coins", value: `${balance.coins}`, inline: true },
        { name: "📅 Daily Claim", value: balance.daily_claimed ? "Claimed today" : "Available", inline: true }
      );

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Balance command error", { error: error.message });
      return interaction.reply({
        embeds: [errorEmbed("Error", "Failed to get balance")],
        ephemeral: true
      });
    }
  }
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
