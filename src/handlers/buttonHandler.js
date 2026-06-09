const { handleTicketButton } = require("../systems/ticketSystem");
const { t } = require("../utils/i18n");
const logger = require("../utils/logger");

async function handleButton(interaction) {
  try {
    if (interaction.customId.startsWith("ticket:")) {
      return await handleTicketButton(interaction);
    }

    return interaction.reply({
      content: t("buttonUnavailable"),
      ephemeral: true
    });
  } catch (error) {
    logger.error("Button handler error", { 
      button: interaction.customId, 
      error: error.message 
    });
    
    return interaction.reply({
      content: t("unexpectedDescription"),
      ephemeral: true
    }).catch(() => null);
  }
}

module.exports = { handleButton };
