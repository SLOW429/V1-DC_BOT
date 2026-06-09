const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { errorEmbed, successEmbed } = require("../../utils/embedBuilder");
const { botCanModerate, canModerate } = require("../../utils/permissions");
const { logModeration } = require("../../systems/moderationSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Kick a member from the server.")
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption((option) => option.setName("user").setDescription("Member to kick").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(false)),
  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member) return interaction.reply({ embeds: [errorEmbed(t("memberNotFound"), t("memberNotFoundDescription"))], ephemeral: true });
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return interaction.reply({ embeds: [errorEmbed(t("missingPermission"), t("kickPermission"))], ephemeral: true });
    if (!canModerate(interaction.member, member)) return interaction.reply({ embeds: [errorEmbed(t("cannotKick"), t("hierarchyUser"))], ephemeral: true });
    if (!botCanModerate(interaction.guild, member)) return interaction.reply({ embeds: [errorEmbed(t("cannotKick"), t("hierarchyBot"))], ephemeral: true });

    await member.kick(`${reason} | By ${interaction.user.tag}`);
    await logModeration(interaction.guild, "Kick", member.user, interaction.user, reason);

    return interaction.reply({ embeds: [successEmbed(t("memberKicked"), t("memberKickedDescription", member.user.tag))] });
  }
};
