const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed } = require("../../utils/embedBuilder");
const { getTopBalances } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Show the economy leaderboard | عرض قائمة الاقتصاد"),

  async execute(interaction) {
    const top = getTopBalances(10);
    const entries = top.length
      ? top.map((row, index) => `**${index + 1}.** <@${row.user_id}> — ${row.coins} ${t("economyCoinsShort")}`).join("\n")
      : t("leaderboardEmpty");

    const embed = baseEmbed({
      title: t("leaderboardTitle"),
      description: entries,
      color: 0x5865f2
    });

    return interaction.reply({ embeds: [embed] });
  }
};