<<<<<<< HEAD
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { setBirthday, getBirthday, getUpcomingBirthdays } = require("../../systems/birthdaySystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Manage birthday settings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your birthday")
        .addIntegerOption((option) => option.setName("month").setDescription("Month (1-12)").setRequired(true).setMinValue(1).setMaxValue(12))
        .addIntegerOption((option) => option.setName("day").setDescription("Day (1-31)").setRequired(true).setMinValue(1).setMaxValue(31))
        .addIntegerOption((option) => option.setName("year").setDescription("Year (optional)").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("check").setDescription("Check someone's birthday")
        .addUserOption((option) => option.setName("user").setDescription("User to check").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("upcoming").setDescription("See upcoming birthdays")
    ),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "set") {
        const month = interaction.options.getInteger("month");
        const day = interaction.options.getInteger("day");
        const year = interaction.options.getInteger("year");

        const result = setBirthday(interaction.user.id, month, day, year);

        return interaction.reply({
          embeds: [baseEmbed({
            title: result.success ? "🎂 Birthday Set!" : "Error",
            description: result.message,
            color: result.success ? colors.success : colors.danger
          })],
          ephemeral: true
        });
      }

      if (subcommand === "check") {
        const targetUser = interaction.options.getUser("user") || interaction.user;
        const birthday = getBirthday(targetUser.id);

        if (!birthday) {
          return interaction.reply({
            embeds: [baseEmbed({
              title: "No Birthday Found",
              description: `${targetUser.username} hasn't set their birthday yet!`,
              color: colors.neutral
            })],
            ephemeral: true
          });
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${monthNames[birthday.month - 1]} ${birthday.day}${birthday.year ? `, ${birthday.year}` : ""}`;

        return interaction.reply({
          embeds: [baseEmbed({
            title: `🎂 ${targetUser.username}'s Birthday`,
            description: dateStr,
            color: colors.primary
          })]
        });
      }

      if (subcommand === "upcoming") {
        const upcoming = getUpcomingBirthdays(30);

        const embed = baseEmbed({
          title: "🎉 Upcoming Birthdays",
          color: colors.primary
        });

        if (upcoming.length === 0) {
          embed.setDescription("No upcoming birthdays!");
        } else {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const description = upcoming
            .slice(0, 10)
            .map((b) => `<@${b.user_id}> - ${monthNames[b.month - 1]} ${b.day}`)
            .join("\n");
          embed.setDescription(description);
        }

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      logger.error("Birthday command error", { error: error.message });
      return interaction.reply({
        embeds: [baseEmbed({
          title: "Error",
          description: "Failed to process birthday command",
          color: colors.danger
        })],
        ephemeral: true
      });
    }
  }
};
=======
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { setBirthday, getBirthday, getUpcomingBirthdays } = require("../../systems/birthdaySystem");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("birthday")
    .setDescription("Manage birthday settings")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set your birthday")
        .addIntegerOption((option) => option.setName("month").setDescription("Month (1-12)").setRequired(true).setMinValue(1).setMaxValue(12))
        .addIntegerOption((option) => option.setName("day").setDescription("Day (1-31)").setRequired(true).setMinValue(1).setMaxValue(31))
        .addIntegerOption((option) => option.setName("year").setDescription("Year (optional)").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("check").setDescription("Check someone's birthday")
        .addUserOption((option) => option.setName("user").setDescription("User to check").setRequired(false))
    )
    .addSubcommand((subcommand) =>
      subcommand.setName("upcoming").setDescription("See upcoming birthdays")
    ),

  async execute(interaction) {
    try {
      const subcommand = interaction.options.getSubcommand();

      if (subcommand === "set") {
        const month = interaction.options.getInteger("month");
        const day = interaction.options.getInteger("day");
        const year = interaction.options.getInteger("year");

        const result = setBirthday(interaction.user.id, month, day, year);

        return interaction.reply({
          embeds: [baseEmbed({
            title: result.success ? "🎂 Birthday Set!" : "Error",
            description: result.message,
            color: result.success ? colors.success : colors.danger
          })],
          ephemeral: true
        });
      }

      if (subcommand === "check") {
        const targetUser = interaction.options.getUser("user") || interaction.user;
        const birthday = getBirthday(targetUser.id);

        if (!birthday) {
          return interaction.reply({
            embeds: [baseEmbed({
              title: "No Birthday Found",
              description: `${targetUser.username} hasn't set their birthday yet!`,
              color: colors.neutral
            })],
            ephemeral: true
          });
        }

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const dateStr = `${monthNames[birthday.month - 1]} ${birthday.day}${birthday.year ? `, ${birthday.year}` : ""}`;

        return interaction.reply({
          embeds: [baseEmbed({
            title: `🎂 ${targetUser.username}'s Birthday`,
            description: dateStr,
            color: colors.primary
          })]
        });
      }

      if (subcommand === "upcoming") {
        const upcoming = getUpcomingBirthdays(30);

        const embed = baseEmbed({
          title: "🎉 Upcoming Birthdays",
          color: colors.primary
        });

        if (upcoming.length === 0) {
          embed.setDescription("No upcoming birthdays!");
        } else {
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const description = upcoming
            .slice(0, 10)
            .map((b) => `<@${b.user_id}> - ${monthNames[b.month - 1]} ${b.day}`)
            .join("\n");
          embed.setDescription(description);
        }

        return interaction.reply({ embeds: [embed] });
      }
    } catch (error) {
      logger.error("Birthday command error", { error: error.message });
      return interaction.reply({
        embeds: [baseEmbed({
          title: "Error",
          description: "Failed to process birthday command",
          color: colors.danger
        })],
        ephemeral: true
      });
    }
  }
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
