const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const { advancedCoinFlip } = require("../../systems/gameSystem");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Flip a coin with multiplier rewards!")
    .addStringOption((option) =>
      option
        .setName("choice")
        .setDescription("Choose heads or tails")
        .setRequired(true)
        .addChoices(
          { name: "Heads", value: "heads" },
          { name: "Tails", value: "tails" }
        )
    )
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet (optional)")
        .setMinValue(1)
        .setMaxValue(1000)
    ),
  async execute(interaction) {
    const choice = interaction.options.getString("choice", true);
    const bet = interaction.options.getNumber("bet") ?? 100;
    const result = advancedCoinFlip();
    
    const won = result.flip === choice;
    const earnings = won ? Math.floor(bet * result.multiplier) : 0;
    const isLucky = result.multiplier === 5;
    
    const resultText = won 
      ? `✅ **${result.flip.toUpperCase()}!** ${isLucky ? "🌟 LUCKY 5x MULTIPLIER! 🌟" : `${result.multiplier}x Multiplier`}\n**Earned: ${earnings} coins!**`
      : `❌ **${result.flip.toUpperCase()}!** You chose ${choice}. Better luck next time!`;

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: "🪙 ENHANCED COIN FLIP",
          description: resultText,
          color: won ? (isLucky ? colors.success : colors.primary) : colors.danger,
          fields: [
            { name: "Bet Amount", value: `${bet}`, inline: true },
            { name: "Multiplier", value: `${result.multiplier}x${isLucky ? " ✨" : ""}`, inline: true },
            { name: "Earnings", value: `${earnings} coins`, inline: true }
          ]
        })
      ]
    });
  }
};
