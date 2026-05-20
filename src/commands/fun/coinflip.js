const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { flipCoin } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin."),
  async execute(interaction) {
    const result = flipCoin() === "heads" ? t("coinHeads") : t("coinTails");

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("gameResult"),
          description: `**${result}**`,
          color: colors.primary
        })
      ]
    });
  }
};
