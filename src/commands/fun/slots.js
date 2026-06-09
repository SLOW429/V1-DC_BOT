const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { playSlots } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("slots")
    .setDescription("Play an enhanced slot machine with multiplier rewards!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet (optional)")
        .setMinValue(1)
        .setMaxValue(1000)
    ),
  async execute(interaction) {
    const bet = interaction.options.getNumber("bet") ?? 100;
    const game = playSlots();
    
    const earnings = game.won ? Math.floor(bet * game.multiplier) : 0;
    const resultText = game.won 
      ? `🎉 **BIG WIN!** ${game.multiplier}x Multiplier! Earned: **${earnings}** coins!${game.twoMatch ? "\n\n✨ Two symbols matched! (3x)" : ""}`
      : `❌ No match. Better luck next time!`;

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: "🎰 ENHANCED SLOT MACHINE",
          description: `**[ ${game.result.join(" | ")} ]**\n\n${resultText}`,
          color: game.won ? colors.success : colors.warning,
          fields: [
            { name: "Bet Amount", value: `${bet}`, inline: true },
            { name: "Multiplier", value: `${game.multiplier}x`, inline: true },
            { name: "Earnings", value: `${earnings} coins`, inline: true }
          ]
        })
      ]
    });
  }
};
