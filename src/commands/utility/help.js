const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show bot command categories."),
  async execute(interaction) {
    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("helpTitle"),
          description: [
            "**Admin:** `/ban`, `/kick`, `/timeout`, `/clear`, `/warn`, `/warnings`",
            "**XP:** `/rank`, `/leaderboard`",
            "**Tickets:** `/ticket-setup`",
            "**Games:** `/coinflip`, `/dice`, `/8ball`, `/rps`, `/slots`, `/trivia`",
            "**Utility:** `/ping`, `/serverinfo`, `/userinfo`, `/avatar`, `/help`"
          ].join("\n"),
          color: colors.primary
        })
      ],
      ephemeral: true
    });
  }
};
