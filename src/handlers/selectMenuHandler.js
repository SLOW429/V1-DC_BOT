const { t } = require("../utils/i18n");

async function handleSelectMenu(interaction) {
  return interaction.reply({
    content: t("selectUnavailable"),
    ephemeral: true
  });
}

module.exports = { handleSelectMenu };
