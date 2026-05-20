const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { successEmbed } = require("../../utils/embedBuilder");
const { addWarning, logModeration } = require("../../systems/moderationSystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Warn a member.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption((option) => option.setName("user").setDescription("Member to warn").setRequired(true))
    .addStringOption((option) => option.setName("reason").setDescription("Reason").setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser("user", true);
    const reason = interaction.options.getString("reason", true);

    addWarning(interaction.guild.id, user.id, interaction.user.id, reason);
    await logModeration(interaction.guild, "Warn", user, interaction.user, reason);

    return interaction.reply({ embeds: [successEmbed(t("memberWarned"), t("memberWarnedDescription", user.tag))] });
  }
};
