const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { getRank, xpForLevel } = require("../../systems/xpSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("rank")
    .setDescription("View your or another member's XP rank.")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("Member to inspect")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const rank = getRank(interaction.guild.id, user.id);
    const nextLevelXp = xpForLevel(rank.level + 1);

    await interaction.reply({
      embeds: [
        baseEmbed({
          title: t("rankTitle", user),
          description: t("rankDescription", rank),
          color: colors.primary
        })
          .setThumbnail(user.displayAvatarURL({ size: 256 }))
          .addFields(
            { name: t("messages"), value: `${rank.messages}`, inline: true },
            { name: t("nextLevel"), value: `${nextLevelXp.toLocaleString()} XP`, inline: true }
          )
      ]
    });
  }
};
