const { Events } = require("discord.js");
const { handleButton } = require("../handlers/buttonHandler");
const { handleSelectMenu } = require("../handlers/selectMenuHandler");
const { errorEmbed } = require("../utils/embedBuilder");
const { t } = require("../utils/i18n");
const cooldownManager = require("../utils/cooldownManager");
const logger = require("../utils/logger");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) {
          logger.debug("Command not found", { command: interaction.commandName });
          return;
        }

        const cooldownKey = `${interaction.commandName}:${interaction.user.id}`;
        const cooldownMs = (command.cooldown || 3) * 1000;
        const remaining = cooldownManager.getRemainingTime(cooldownKey);

        if (remaining) {
          const seconds = Math.ceil(remaining / 1000);
          logger.debug("Command on cooldown", { command: interaction.commandName, user: interaction.user.id, remaining: seconds });
          return interaction.reply({
            embeds: [errorEmbed(t("cooldownTitle"), t("cooldownDescription", seconds))],
            ephemeral: true
          });
        }

        cooldownManager.setCooldown(cooldownKey, cooldownMs);
        logger.debug("Command executed", { command: interaction.commandName, user: interaction.user.id });

        await command.execute(interaction);
        return;
      }

      if (interaction.isButton()) {
        await handleButton(interaction);
        return;
      }

      if (interaction.isStringSelectMenu()) {
        await handleSelectMenu(interaction);
      }
    } catch (error) {
      logger.error("interactionCreate error", { error: error.message, stack: error.stack });
      const payload = {
        embeds: [errorEmbed(t("unexpectedTitle"), t("unexpectedDescription"))],
        ephemeral: true
      };

      try {
        if (interaction.deferred || interaction.replied) {
          await interaction.editReply(payload);
        } else {
          await interaction.reply(payload);
        }
      } catch (replyError) {
        logger.error("Failed to reply to interaction", { error: replyError.message });
      }
    }
  }
};
