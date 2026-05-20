const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { errorEmbed, successEmbed } = require("../../utils/embedBuilder");
const { sendLog } = require("../../systems/logSystem");
const { colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Bulk delete recent messages.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to delete, 1-100")
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount", true);

    if (!interaction.guild.members.me.permissions.has(PermissionFlagsBits.ManageMessages)) {
      return interaction.reply({ embeds: [errorEmbed(t("missingPermission"), t("clearPermission"))], ephemeral: true });
    }

    const deleted = await interaction.channel.bulkDelete(amount, true);
    await sendLog(interaction.guild, {
      title: t("messagesCleared"),
      description: `${interaction.user.tag} deleted ${deleted.size} messages in ${interaction.channel}.`,
      color: colors.warning
    });

    return interaction.reply({ embeds: [successEmbed(t("messagesCleared"), t("messagesClearedDescription", deleted.size))], ephemeral: true });
  }
};
