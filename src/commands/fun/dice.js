const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { advancedDiceRoll } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("dice")
    .setDescription("Roll advanced dice with bonuses!")
    .addIntegerOption((option) =>
      option
        .setName("sides")
        .setDescription("Dice sides, from 2 to 100")
        .setMinValue(2)
        .setMaxValue(100)
        .setRequired(false)
    )
    .addIntegerOption((option) =>
      option
        .setName("count")
        .setDescription("Number of dice to roll (1-10)")
        .setMinValue(1)
        .setMaxValue(10)
        .setRequired(false)
    ),
  async execute(interaction) {
    const sides = interaction.options.getInteger("sides") || 6;
    const count = interaction.options.getInteger("count") || 1;
    const result = advancedDiceRoll(count, sides);
    
    const bonusText = result.bonus > 0 
      ? `🎉 **BONUS ROLL!** +${result.bonus} extra coins!` 
      : "Roll again to get bonuses!";

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: `🎲 ADVANCED DICE ROLL (${count}d${sides})`,
          description: `**Rolls:** ${result.rolls.join(", ")}\n\n${bonusText}`,
          color: result.bonus > 0 ? colors.success : colors.primary,
          fields: [
            { name: "Total", value: `${result.total}`, inline: true },
            { name: "Bonus", value: `+${result.bonus}`, inline: true },
            { name: "Final Total", value: `${result.finalTotal}`, inline: true }
          ]
        })
      ]
    });
  }
};
