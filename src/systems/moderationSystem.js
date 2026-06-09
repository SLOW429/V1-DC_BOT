const db = require("../database/db");
const { sendLog } = require("./logSystem");
const { colors } = require("../utils/embedBuilder");

function addWarning(guildId, userId, moderatorId, reason) {
  return db.prepare(`
    INSERT INTO warnings (guild_id, user_id, moderator_id, reason, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(guildId, userId, moderatorId, reason, Date.now());
}

function getWarnings(guildId, userId) {
  return db.prepare(`
    SELECT * FROM warnings
    WHERE guild_id = ? AND user_id = ?
    ORDER BY created_at DESC
  `).all(guildId, userId);
}

async function logModeration(guild, action, target, moderator, reason) {
  return sendLog(guild, {
    title: `Moderation: ${action}`,
    description: `${target} was ${action.toLowerCase()}.`,
    color: colors.warning,
    fields: [
      { name: "User", value: `${target.tag || target.user?.tag || target.id}`, inline: true },
      { name: "Moderator", value: `${moderator.tag || moderator.user?.tag || moderator.id}`, inline: true },
      { name: "Reason", value: reason || "No reason provided", inline: false }
    ]
  });
}

module.exports = {
  addWarning,
  getWarnings,
  logModeration
};
