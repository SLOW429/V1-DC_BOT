const config = require("../config");
const { t } = require("../utils/i18n");

const recentMessages = new Map();
const linkRegex = /(https?:\/\/|discord\.gg\/|www\.)/i;

async function runProtections(message) {
  if (!message.guild || message.author.bot) return false;

  if (config.features.antiLink && linkRegex.test(message.content)) {
    if (!message.member.permissions.has("ManageMessages")) {
      await message.delete().catch(() => null);
      await message.channel.send({ content: t("linkBlocked", message.author) })
        .then((sent) => setTimeout(() => sent.delete().catch(() => null), 5000))
        .catch(() => null);
      return true;
    }
  }

  if (config.features.antiSpam) {
    const key = `${message.guild.id}:${message.author.id}`;
    const now = Date.now();
    const entries = (recentMessages.get(key) || []).filter((time) => now - time < 7000);
    entries.push(now);
    recentMessages.set(key, entries);

    if (entries.length >= 5) {
      await message.delete().catch(() => null);
      return true;
    }
  }

  return false;
}

module.exports = { runProtections };
