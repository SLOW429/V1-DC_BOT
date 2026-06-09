const { SlashCommandBuilder } = require("discord.js");
const { successEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { buyItem } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Purchase an item from the shop | شراء عنصر من المتجر")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Shop item key | مفتاح عنصر المتجر")
        .setRequired(true)
    ),

  async execute(interaction) {
    const itemKey = interaction.options.getString("item", true).toLowerCase();
    const result = buyItem(interaction.user.id, itemKey);

    if (!result.success) {
      return interaction.reply({
        embeds: [errorEmbed(t("buyTitle"), t(result.reason === "INSUFFICIENT" ? "buyInsufficient" : "buyNotFound", result.missing || 0))],
        ephemeral: true
      });
    }

    return interaction.reply({
      embeds: [
        successEmbed(
          t("buyTitle"),
          t("buySuccessMessage", result.item.name, result.item.price)
        )
      ]
    });
  }
};