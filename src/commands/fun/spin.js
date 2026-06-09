<<<<<<< HEAD
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { playLuckySpin } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("spin")
    .setDescription("Play the Lucky Spin game with huge multiplier rewards!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet (optional)")
        .setMinValue(1)
        .setMaxValue(1000)
    ),
  async execute(interaction) {
    const bet = interaction.options.getNumber("bet") ?? 100;
    const game = playLuckySpin();
    const earnings = Math.floor(bet * game.multiplier);

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: "🎡 LUCKY SPIN WHEEL",
          description: `${game.message}\n\n**Landed on:** ${game.result}`,
          color: game.multiplier >= 5 ? colors.success : game.multiplier >= 2.5 ? colors.primary : colors.warning,
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
=======
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { playLuckySpin } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("spin")
    .setDescription("Play the Lucky Spin game with huge multiplier rewards!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet (optional)")
        .setMinValue(1)
        .setMaxValue(1000)
    ),
  async execute(interaction) {
    const bet = interaction.options.getNumber("bet") ?? 100;
    const game = playLuckySpin();
    const earnings = Math.floor(bet * game.multiplier);

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: "🎡 LUCKY SPIN WHEEL",
          description: `${game.message}\n\n**Landed on:** ${game.result}`,
          color: game.multiplier >= 5 ? colors.success : game.multiplier >= 2.5 ? colors.primary : colors.warning,
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
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
