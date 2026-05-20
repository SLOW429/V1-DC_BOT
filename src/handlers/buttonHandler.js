const { handleTicketButton } = require("../systems/ticketSystem");
const { t } = require("../utils/i18n");

async function handleButton(interaction) {
  if (interaction.customId.startsWith("ticket:")) {
    return handleTicketButton(interaction);
  }

  return interaction.reply({
    content: t("buttonUnavailable"),
    ephemeral: true
  });
}

module.exports = { handleButton };
