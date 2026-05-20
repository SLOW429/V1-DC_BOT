const { Events } = require("discord.js");
const { handleButton } = require("../handlers/buttonHandler");
const { handleSelectMenu } = require("../handlers/selectMenuHandler");
const { errorEmbed } = require("../utils/embedBuilder");
const { t } = require("../utils/i18n");

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = interaction.client.commands.get(interaction.commandName);
        if (!command) return;

        const cooldownKey = `${interaction.commandName}:${interaction.user.id}`;
        const now = Date.now();
        const cooldownMs = (command.cooldown || 3) * 1000;
        const expires = interaction.client.cooldowns.get(cooldownKey) || 0;

        if (expires > now) {
          return interaction.reply({
            embeds: [errorEmbed(t("cooldownTitle"), t("cooldownDescription", Math.ceil((expires - now) / 1000)))],
            ephemeral: true
          });
        }

        interaction.client.cooldowns.set(cooldownKey, now + cooldownMs);
        setTimeout(() => interaction.client.cooldowns.delete(cooldownKey), cooldownMs);

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
      console.error("interactionCreate error:", error);
      const payload = {
        embeds: [errorEmbed(t("unexpectedTitle"), t("unexpectedDescription"))],
        ephemeral: true
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.editReply(payload).catch(() => null);
      } else {
        await interaction.reply(payload).catch(() => null);
      }
    }
  }
};
