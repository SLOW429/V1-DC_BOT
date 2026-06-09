const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { getBalance } = require("../../systems/economySystem");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check a user's coin balance | تحقق من رصيد العملات")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to inspect | العضو المراد فحصه").setRequired(false)
    ),

  async execute(interaction) {
    const target = interaction.options.getUser("user") || interaction.user;
    const balance = getBalance(target.id);

    if (!balance) {
      return interaction.reply({
        embeds: [errorEmbed(t("balanceTitle"), t("balanceError"))],
        ephemeral: true
      });
    }

    const embed = baseEmbed({
      title: t("balanceTitle", target.username),
      description: t("balanceDescription"),
      color: colors.success,
      fields: [
        { name: t("economyCoins"), value: `${balance.coins}`, inline: true },
        {
          name: t("economyDailyStatus"),
          value: balance.daily_claimed && Date.now() - balance.daily_claimed < 86400000 ? t("economyDailyClaimed") : t("economyDailyAvailable"),
          inline: true
        }
      ]
    });

    return interaction.reply({ embeds: [embed] });
  }
};