const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { getLeaderboard } = require("../../systems/xpSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("View the server XP leaderboard."),
  async execute(interaction) {
    const rows = getLeaderboard(interaction.guild.id, 10);
    const description = rows.length
      ? rows.map((row, index) => `**${index + 1}.** <@${row.user_id}> - Level ${row.level}, ${row.xp.toLocaleString()} XP`).join("\n")
      : t("noXp");

    await interaction.reply({
      embeds: [
        baseEmbed({
          title: t("leaderboardTitle"),
          description,
          color: colors.primary
        })
      ]
    });
  }
};
