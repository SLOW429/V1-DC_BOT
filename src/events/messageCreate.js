const { Events } = require("discord.js");
<<<<<<< HEAD
const config = require("../config");
const { addMessageXp } = require("../systems/xpSystem");
const { runProtections } = require("../systems/protectionSystem");
const { handleOwnerFeatures } = require("../systems/ownerFeaturesSystem");
const { errorEmbed } = require("../utils/embedBuilder");
const { t } = require("../utils/i18n");
const cooldownManager = require("../utils/cooldownManager");
const logger = require("../utils/logger");
=======
const { addMessageXp } = require("../systems/xpSystem");
const { runProtections } = require("../systems/protectionSystem");
const { handleOwnerFeatures } = require("../systems/ownerFeaturesSystem");
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
<<<<<<< HEAD
      if (message.author.bot || !message.guild) return;

      const ownerHandled = await handleOwnerFeatures(message);
      if (ownerHandled) return;

      const blocked = await runProtections(message);
      if (!blocked) {
        await addMessageXp(message);
      }

      if (!message.content.startsWith(config.commandPrefix)) return;

      const content = message.content.slice(config.commandPrefix.length).trim();
      if (!content) return;

      const [commandName, ...args] = content.split(/\s+/);
      const normalizedName = commandName.toLowerCase();
      const prefixCommand = message.client.prefixCommands?.get(normalizedName);
      if (!prefixCommand) return;

      const cooldownKey = `${prefixCommand.name || normalizedName}:${message.author.id}`;
      const remaining = cooldownManager.getRemainingTime(cooldownKey);
      if (remaining) {
        return message.reply({
          embeds: [errorEmbed(t("cooldownTitle"), t("cooldownDescription", Math.ceil(remaining / 1000)))],
          allowedMentions: { repliedUser: false }
        });
      }

      cooldownManager.setCooldown(cooldownKey, (prefixCommand.cooldown || 3) * 1000);
      await prefixCommand.execute(message, args);
    } catch (error) {
      logger.error("messageCreate error", { error: error.message, stack: error.stack });
=======
      // Handle owner special features first
      await handleOwnerFeatures(message);
      
      const blocked = await runProtections(message);
      if (!blocked) await addMessageXp(message);
    } catch (error) {
      console.error("messageCreate error:", error);
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
    }
  }
};
