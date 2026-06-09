const db = require("../database/db");
const config = require("../config");
const { successEmbed } = require("../utils/embedBuilder");
const { t } = require("../utils/i18n");

const cooldowns = new Map();

function xpForLevel(level) {
  return 100 * level * level;
}

function randomXp() {
  return Math.floor(Math.random() * (config.xp.max - config.xp.min + 1)) + config.xp.min;
}

function getRank(guildId, userId) {
  const row = db.prepare("SELECT * FROM xp WHERE guild_id = ? AND user_id = ?").get(guildId, userId);
  return row || { guild_id: guildId, user_id: userId, xp: 0, level: 0, messages: 0 };
}

function getLeaderboard(guildId, limit = 10) {
  return db.prepare(`
    SELECT * FROM xp
    WHERE guild_id = ?
    ORDER BY level DESC, xp DESC
    LIMIT ?
  `).all(guildId, limit);
}

async function addMessageXp(message) {
  if (!message.guild || message.author.bot) return;

  const key = `${message.guild.id}:${message.author.id}`;
  const now = Date.now();
  const expires = cooldowns.get(key) || 0;
  if (expires > now) return;

  cooldowns.set(key, now + config.xp.cooldownSeconds * 1000);

  const current = getRank(message.guild.id, message.author.id);
  const gained = randomXp();
  let totalXp = current.xp + gained;
  let level = current.level;
  let leveledUp = false;

  while (totalXp >= xpForLevel(level + 1)) {
    level += 1;
    leveledUp = true;
  }

  db.prepare(`
    INSERT INTO xp (guild_id, user_id, xp, level, messages, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
    ON CONFLICT(guild_id, user_id)
    DO UPDATE SET xp = excluded.xp, level = excluded.level, messages = excluded.messages, updated_at = excluded.updated_at
  `).run(message.guild.id, message.author.id, totalXp, level, current.messages + 1, now);

  if (leveledUp) {
    await message.channel.send({
      embeds: [
        successEmbed(t("levelUp"), t("levelUpDescription", message.author, level))
          .setThumbnail(message.author.displayAvatarURL({ size: 256 }))
      ]
    }).catch(() => null);
  }
}

module.exports = {
  addMessageXp,
  getRank,
  getLeaderboard,
  xpForLevel
};
