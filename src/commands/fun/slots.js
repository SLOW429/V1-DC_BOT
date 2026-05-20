const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { playSlots } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Play a simple slot machine."),
  async execute(interaction) {
    const game = playSlots();

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("slotsTitle"),
          description: `**[ ${game.result.join(" | ")} ]**\n${game.won ? t("slotsWin") : t("slotsLose")}`,
          color: game.won ? colors.success : colors.warning
        })
      ]
    });
  }
};
