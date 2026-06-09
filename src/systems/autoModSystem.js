<<<<<<< HEAD
/**
 * Auto Moderation System - Detect and prevent spam, raids, etc.
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize moderation tables
function initializeAutoMod() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS message_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS infractions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS muted_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        duration INTEGER NOT NULL,
        reason TEXT NOT NULL,
        muted_at INTEGER NOT NULL,
        muted_until INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_msg_logs_user ON message_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_infractions_user ON infractions(user_id);
      CREATE INDEX IF NOT EXISTS idx_muted_guild ON muted_users(guild_id);
    `);
    
    logger.log("Auto moderation system initialized");
  } catch (error) {
    logger.error("Failed to initialize auto mod", { error: error.message });
  }
}

function logMessage(userId, guildId, message) {
  try {
    const stmt = db.prepare(`
      INSERT INTO message_logs (user_id, guild_id, message, created_at)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(userId, guildId, message.substring(0, 500), Date.now());
  } catch (error) {
    logger.error("Failed to log message", { error: error.message });
  }
}

function checkSpam(userId, guildId, threshold = 5) {
  try {
    const oneMinuteAgo = Date.now() - (60 * 1000);
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM message_logs 
      WHERE user_id = ? AND guild_id = ? AND created_at > ?
    `);
    
    const result = stmt.get(userId, guildId, oneMinuteAgo);
    return result.count >= threshold;
  } catch (error) {
    logger.error("Failed to check spam", { error: error.message });
    return false;
  }
}

function addInfraction(userId, guildId, type, reason) {
  try {
    const stmt = db.prepare(`
      INSERT INTO infractions (user_id, guild_id, type, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, guildId, type, reason.substring(0, 200), Date.now());
    return true;
  } catch (error) {
    logger.error("Failed to add infraction", { error: error.message });
    return false;
  }
}

function getInfractions(userId, guildId) {
  try {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM infractions 
      WHERE user_id = ? AND guild_id = ?
    `);
    
    const result = stmt.get(userId, guildId);
    return result?.count || 0;
  } catch (error) {
    logger.error("Failed to get infractions", { error: error.message });
    return 0;
  }
}

function muteUser(userId, guildId, durationSeconds, reason) {
  try {
    const now = Date.now();
    const muteUntil = now + (durationSeconds * 1000);
    
    const stmt = db.prepare(`
      INSERT INTO muted_users (user_id, guild_id, duration, reason, muted_at, muted_until)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, guildId, durationSeconds, reason.substring(0, 200), now, muteUntil);
    return true;
  } catch (error) {
    logger.error("Failed to mute user", { error: error.message });
    return false;
  }
}

function isMuted(userId, guildId) {
  try {
    const now = Date.now();
    const stmt = db.prepare(`
      SELECT * FROM muted_users 
      WHERE user_id = ? AND guild_id = ? AND muted_until > ?
    `);
    
    const result = stmt.get(userId, guildId, now);
    return !!result;
  } catch (error) {
    logger.error("Failed to check mute status", { error: error.message });
    return false;
  }
}

function unmuteUser(userId, guildId) {
  try {
    const stmt = db.prepare(`
      DELETE FROM muted_users 
      WHERE user_id = ? AND guild_id = ?
    `);
    
    stmt.run(userId, guildId);
    return true;
  } catch (error) {
    logger.error("Failed to unmute user", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeAutoMod,
  logMessage,
  checkSpam,
  addInfraction,
  getInfractions,
  muteUser,
  isMuted,
  unmuteUser
};
=======
/**
 * Auto Moderation System - Detect and prevent spam, raids, etc.
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize moderation tables
function initializeAutoMod() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS message_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS infractions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS muted_users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        duration INTEGER NOT NULL,
        reason TEXT NOT NULL,
        muted_at INTEGER NOT NULL,
        muted_until INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_msg_logs_user ON message_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_infractions_user ON infractions(user_id);
      CREATE INDEX IF NOT EXISTS idx_muted_guild ON muted_users(guild_id);
    `);
    
    logger.log("Auto moderation system initialized");
  } catch (error) {
    logger.error("Failed to initialize auto mod", { error: error.message });
  }
}

function logMessage(userId, guildId, message) {
  try {
    const stmt = db.prepare(`
      INSERT INTO message_logs (user_id, guild_id, message, created_at)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(userId, guildId, message.substring(0, 500), Date.now());
  } catch (error) {
    logger.error("Failed to log message", { error: error.message });
  }
}

function checkSpam(userId, guildId, threshold = 5) {
  try {
    const oneMinuteAgo = Date.now() - (60 * 1000);
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM message_logs 
      WHERE user_id = ? AND guild_id = ? AND created_at > ?
    `);
    
    const result = stmt.get(userId, guildId, oneMinuteAgo);
    return result.count >= threshold;
  } catch (error) {
    logger.error("Failed to check spam", { error: error.message });
    return false;
  }
}

function addInfraction(userId, guildId, type, reason) {
  try {
    const stmt = db.prepare(`
      INSERT INTO infractions (user_id, guild_id, type, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, guildId, type, reason.substring(0, 200), Date.now());
    return true;
  } catch (error) {
    logger.error("Failed to add infraction", { error: error.message });
    return false;
  }
}

function getInfractions(userId, guildId) {
  try {
    const stmt = db.prepare(`
      SELECT COUNT(*) as count FROM infractions 
      WHERE user_id = ? AND guild_id = ?
    `);
    
    const result = stmt.get(userId, guildId);
    return result?.count || 0;
  } catch (error) {
    logger.error("Failed to get infractions", { error: error.message });
    return 0;
  }
}

function muteUser(userId, guildId, durationSeconds, reason) {
  try {
    const now = Date.now();
    const muteUntil = now + (durationSeconds * 1000);
    
    const stmt = db.prepare(`
      INSERT INTO muted_users (user_id, guild_id, duration, reason, muted_at, muted_until)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(userId, guildId, durationSeconds, reason.substring(0, 200), now, muteUntil);
    return true;
  } catch (error) {
    logger.error("Failed to mute user", { error: error.message });
    return false;
  }
}

function isMuted(userId, guildId) {
  try {
    const now = Date.now();
    const stmt = db.prepare(`
      SELECT * FROM muted_users 
      WHERE user_id = ? AND guild_id = ? AND muted_until > ?
    `);
    
    const result = stmt.get(userId, guildId, now);
    return !!result;
  } catch (error) {
    logger.error("Failed to check mute status", { error: error.message });
    return false;
  }
}

function unmuteUser(userId, guildId) {
  try {
    const stmt = db.prepare(`
      DELETE FROM muted_users 
      WHERE user_id = ? AND guild_id = ?
    `);
    
    stmt.run(userId, guildId);
    return true;
  } catch (error) {
    logger.error("Failed to unmute user", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeAutoMod,
  logMessage,
  checkSpam,
  addInfraction,
  getInfractions,
  muteUser,
  isMuted,
  unmuteUser
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
