const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed } = require("../../utils/embedBuilder");
const { getShopItems } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View available shop items | عرض عناصر المتجر"),

  async execute(interaction) {
    const items = getShopItems();

    const description = items
      .map((item) => `**${item.emoji} ${item.name}** (${item.key}) — ${item.price} ${t("economyCoinsShort")}\n${item.description}`)
      .join("\n\n");

    const embed = baseEmbed({
      title: t("shopTitle"),
      description,
      color: 0xf1c40f
    });

    return interaction.reply({ embeds: [embed] });
  }
};