const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { getInventory } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("inventory")
    .setDescription("View your purchased shop items | عرض عناصر المتجر الخاصة بك"),

  async execute(interaction) {
    const entries = getInventory(interaction.user.id);
    if (!entries.length) {
      return interaction.reply({
        embeds: [errorEmbed(t("inventoryTitle"), t("inventoryEmpty"))],
        ephemeral: true
      });
    }

    const description = entries
      .map((entry) => `**${entry.item_name}** — x${entry.quantity}`)
      .join("\n");

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("inventoryTitle"),
          description,
          color: 0x2ecc71
        })
      ]
    });
  }
};