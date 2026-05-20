const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { rollDice } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll a dice.")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Dice sides, from 2 to 100")
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides") || 6;
    const result = rollDice(sides);

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("gameResult"),
          description: t("diceRolled", sides, result),
          color: colors.primary
        })
      ]
    });
  }
};
