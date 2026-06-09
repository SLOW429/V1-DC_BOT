const ms = require("ms");
const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { errorEmbed, successEmbed } = require("../../utils/embedBuilder");
const { botCanModerate, canModerate } = require("../../utils/permissions");
const { logModeration } = require("../../systems/moderationSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Timeout a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("user").setDescription("Member to timeout").setRequired(true))
    .addStringOption((option) => option.setName("duration").setDescription("Example: 10m, 1h, 1d").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(false)),
  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const durationInput = interaction.options.getString("duration", true);
    const reason = interaction.options.getString("reason") || "No reason provided";
    const duration = ms(durationInput);

    if (!member) return interaction.reply({ embeds: [errorEmbed(t("memberNotFound"), t("memberNotFoundDescription"))], ephemeral: true });
    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ModerateMembers)) return interaction.reply({ embeds: [errorEmbed(t("missingPermission"), t("timeoutPermission"))], ephemeral: true });
    if (!duration || duration < 5000 || duration > 28 * 24 * 60 * 60 * 1000) {
      return interaction.reply({ embeds: [errorEmbed(t("invalidDuration"), t("invalidDurationDescription"))], ephemeral: true });
    }
    if (!canModerate(interaction.member, member)) return interaction.reply({ embeds: [errorEmbed(t("cannotTimeout"), t("hierarchyUser"))], ephemeral: true });
    if (!botCanModerate(interaction.guild, member)) return interaction.reply({ embeds: [errorEmbed(t("cannotTimeout"), t("hierarchyBot"))], ephemeral: true });

    await member.timeout(duration, `${reason} | By ${interaction.user.tag}`);
    await logModeration(interaction.guild, "Timeout", member.user, interaction.user, `${reason} (${durationInput})`);

    return interaction.reply({ embeds: [successEmbed(t("memberTimedOut"), t("memberTimedOutDescription", member.user.tag, durationInput))] });
  }
};
