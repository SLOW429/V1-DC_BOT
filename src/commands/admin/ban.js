const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { errorEmbed, successEmbed } = require("../../utils/embedBuilder");
const { botCanModerate, canModerate } = require("../../utils/permissions");
const { logModeration } = require("../../systems/moderationSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a member from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption((option) => option.setName("user").setDescription("Member to ban").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(false)),
  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.BanMembers)) {
      return interaction.reply({ embeds: [errorEmbed(t("missingPermission"), t("banPermission"))], ephemeral: true });
    }

    if (member && !canModerate(interaction.member, member)) {
      return interaction.reply({ embeds: [errorEmbed(t("cannotBan"), t("hierarchyUser"))], ephemeral: true });
    }

    if (member && !botCanModerate(interaction.guild, member)) {
      return interaction.reply({ embeds: [errorEmbed(t("cannotBan"), t("hierarchyBot"))], ephemeral: true });
    }

    await interaction.guild.members.ban(user.id, { reason: `${reason} | By ${interaction.user.tag}` });
    await logModeration(interaction.guild, "Ban", user, interaction.user, reason);

    return interaction.reply({ embeds: [successEmbed(t("memberBanned"), t("memberBannedDescription", user.tag))] });
  }
};
