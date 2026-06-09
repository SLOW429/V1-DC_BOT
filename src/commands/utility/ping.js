const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Check the bot latency."),
  async execute(interaction) {
    const sent = await interaction.reply({
      embeds: [
        baseEmbed({
          title: t("pingTitle"),
          description: "Checking latency...",
          color: colors.primary
        })
      ],
      fetchReply: true
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    return interaction.editReply({
      embeds: [
        baseEmbed({
          title: t("pingTitle"),
          description: `Bot latency: **${latency}ms**\nWebSocket: **${interaction.client.ws.ping}ms**`,
          color: colors.success
        })
      ]
    });
  }
};
