const { t } = require("../utils/i18n");
const logger = require("../utils/logger");

async function handleSelectMenu(interaction) {
  try {
    logger.debug("Select menu interaction", { menu: interaction.customId });
    
    return interaction.reply({
      content: t("selectUnavailable"),
      ephemeral: true
    });
  } catch (error) {
    logger.error("Select menu handler error", { 
      menu: interaction.customId, 
      error: error.message 
    });
    
    return interaction.reply({
      content: t("unexpectedDescription"),
      ephemeral: true
    }).catch(() => null);
  }
}

module.exports = { handleSelectMenu };
