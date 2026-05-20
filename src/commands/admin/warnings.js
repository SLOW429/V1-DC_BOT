const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { getWarnings } = require("../../systems/moderationSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("warnings")
    .setDescription("View warnings for a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("user").setDescription("Member to inspect").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const warnings = getWarnings(interaction.guild.id, user.id);
    const description = warnings.length
      ? warnings.slice(0, 10).map((warning) => `**#${warning.id}** <t:${Math.floor(warning.created_at / 1000)}:R> by <@${warning.moderator_id}>\n${warning.reason}`).join("\n\n")
      : t("noWarnings");

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("warningsFor", user.tag),
          description,
          color: colors.warning
        })
      ],
      ephemeral: true
    });
  }
};
