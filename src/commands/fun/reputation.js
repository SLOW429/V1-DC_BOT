<<<<<<< HEAD
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { getReputation, getTopReputation, giveReputation } = require("../../systems/reputationSystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Give or check reputation points")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give reputation to a user")
        .addUserOption((option) => option.setName("user").setDescription("User to give rep to").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("Why give them rep?").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("check").setDescription("Check a user's reputation")
        .addUserOption((option) => option.setName("user").setDescription("User to check").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("leaderboard").setDescription("View reputation leaderboard")
    ),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "give") {
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "";

        const result = giveReputation(interaction.user.id, targetUser.id, 1, reason);

        return interaction.reply({
          embeds: [baseEmbed({
            title: result.success ? "✅ Reputation Given!" : "❌ Error",
            description: result.message,
            color: result.success ? 0x2ecc71 : 0xe74c3c
          })],
          ephemeral: true
        });
      }

      if (subcommand === "check") {
        const targetUser = interaction.options.getUser("user") || interaction.user;
        const rep = getReputation(targetUser.id);

        const embed = baseEmbed({
          title: `⭐ ${targetUser.username}'s Reputation`,
          color: colors.primary
        });

        embed.addFields(
          { name: "Points", value: `${rep.points}`, inline: true },
          { name: "Received", value: `${rep.received_count}`, inline: true },
          { name: "Given", value: `${rep.given_count}`, inline: true }
        );

        return interaction.reply({ embeds: [embed] });
      }

      if (subcommand === "leaderboard") {
        const topReps = getTopReputation(10);

        const embed = baseEmbed({
          title: "🏆 Reputation Leaderboard",
          color: colors.primary
        });

        if (topReps.length === 0) {
          embed.setDescription("No reputation points yet!");
        } else {
          const description = topReps
            .map((rep, i) => `${i + 1}. <@${rep.user_id}> - ${rep.points} points`)
            .join("\n");
          embed.setDescription(description);
        }

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      logger.error("Reputation command error", { error: error.message });
      return interaction.reply({
        embeds: [baseEmbed({
          title: "Error",
          description: "Failed to process reputation command",
          color: 0xe74c3c
        })],
        ephemeral: true
      });
    }
  }
};
=======
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { getReputation, getTopReputation, giveReputation } = require("../../systems/reputationSystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("reputation")
    .setDescription("Give or check reputation points")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("give")
        .setDescription("Give reputation to a user")
        .addUserOption((option) => option.setName("user").setDescription("User to give rep to").setRequired(true))
        .addStringOption((option) => option.setName("reason").setDescription("Why give them rep?").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("check").setDescription("Check a user's reputation")
        .addUserOption((option) => option.setName("user").setDescription("User to check").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("leaderboard").setDescription("View reputation leaderboard")
    ),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "give") {
        const targetUser = interaction.options.getUser("user");
        const reason = interaction.options.getString("reason") || "";

        const result = giveReputation(interaction.user.id, targetUser.id, 1, reason);

        return interaction.reply({
          embeds: [baseEmbed({
            title: result.success ? "✅ Reputation Given!" : "❌ Error",
            description: result.message,
            color: result.success ? 0x2ecc71 : 0xe74c3c
          })],
          ephemeral: true
        });
      }

      if (subcommand === "check") {
        const targetUser = interaction.options.getUser("user") || interaction.user;
        const rep = getReputation(targetUser.id);

        const embed = baseEmbed({
          title: `⭐ ${targetUser.username}'s Reputation`,
          color: colors.primary
        });

        embed.addFields(
          { name: "Points", value: `${rep.points}`, inline: true },
          { name: "Received", value: `${rep.received_count}`, inline: true },
          { name: "Given", value: `${rep.given_count}`, inline: true }
        );

        return interaction.reply({ embeds: [embed] });
      }

      if (subcommand === "leaderboard") {
        const topReps = getTopReputation(10);

        const embed = baseEmbed({
          title: "🏆 Reputation Leaderboard",
          color: colors.primary
        });

        if (topReps.length === 0) {
          embed.setDescription("No reputation points yet!");
        } else {
          const description = topReps
            .map((rep, i) => `${i + 1}. <@${rep.user_id}> - ${rep.points} points`)
            .join("\n");
          embed.setDescription(description);
        }

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      logger.error("Reputation command error", { error: error.message });
      return interaction.reply({
        embeds: [baseEmbed({
          title: "Error",
          description: "Failed to process reputation command",
          color: 0xe74c3c
        })],
        ephemeral: true
      });
    }
  }
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
