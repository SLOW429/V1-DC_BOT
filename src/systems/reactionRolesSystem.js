<<<<<<< HEAD
/**
 * Reaction Roles System - Users react to message to get roles
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize reaction roles tables
function initializeReactionRoles() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS reaction_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        message_id TEXT NOT NULL,
        emoji TEXT NOT NULL,
        role_id TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_reaction_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        obtained_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_reaction_message ON reaction_roles(message_id);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_reaction_roles(user_id);
    `);
    
    logger.log("Reaction roles system initialized");
  } catch (error) {
    logger.error("Failed to initialize reaction roles", { error: error.message });
  }
}

function addReactionRole(guildId, messageId, emoji, roleId) {
  try {
    const stmt = db.prepare(`
      INSERT INTO reaction_roles (guild_id, message_id, emoji, role_id, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(guildId, messageId, emoji, roleId, Date.now());
    return true;
  } catch (error) {
    logger.error("Failed to add reaction role", { error: error.message });
    return false;
  }
}

function getReactionRoles(messageId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM reaction_roles WHERE message_id = ?
    `);
    
    return stmt.all(messageId);
  } catch (error) {
    logger.error("Failed to get reaction roles", { error: error.message });
    return [];
  }
}

function getRoleIdByReaction(messageId, emoji) {
  try {
    const stmt = db.prepare(`
      SELECT role_id FROM reaction_roles 
      WHERE message_id = ? AND emoji = ?
    `);
    
    const result = stmt.get(messageId, emoji);
    return result?.role_id || null;
  } catch (error) {
    logger.error("Failed to get role by reaction", { error: error.message });
    return null;
  }
}

function giveReactionRole(userId, guildId, roleId) {
  try {
    const stmt = db.prepare(`
      INSERT INTO user_reaction_roles (user_id, guild_id, role_id, obtained_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `);
    
    stmt.run(userId, guildId, roleId, Date.now());
    return true;
  } catch (error) {
    logger.error("Failed to give reaction role", { error: error.message });
    return false;
  }
}

function removeReactionRole(userId, roleId) {
  try {
    const stmt = db.prepare(`
      DELETE FROM user_reaction_roles 
      WHERE user_id = ? AND role_id = ?
    `);
    
    stmt.run(userId, roleId);
    return true;
  } catch (error) {
    logger.error("Failed to remove reaction role", { error: error.message });
    return false;
  }
}

function hasReactionRole(userId, roleId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM user_reaction_roles 
      WHERE user_id = ? AND role_id = ?
    `);
    
    return !!stmt.get(userId, roleId);
  } catch (error) {
    logger.error("Failed to check reaction role", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeReactionRoles,
  addReactionRole,
  getReactionRoles,
  getRoleIdByReaction,
  giveReactionRole,
  removeReactionRole,
  hasReactionRole
};
=======
/**
 * Reaction Roles System - Users react to message to get roles
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize reaction roles tables
function initializeReactionRoles() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS reaction_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        guild_id TEXT NOT NULL,
        message_id TEXT NOT NULL,
        emoji TEXT NOT NULL,
        role_id TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_reaction_roles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        guild_id TEXT NOT NULL,
        role_id TEXT NOT NULL,
        obtained_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_reaction_message ON reaction_roles(message_id);
      CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_reaction_roles(user_id);
    `);
    
    logger.log("Reaction roles system initialized");
  } catch (error) {
    logger.error("Failed to initialize reaction roles", { error: error.message });
  }
}

function addReactionRole(guildId, messageId, emoji, roleId) {
  try {
    const stmt = db.prepare(`
      INSERT INTO reaction_roles (guild_id, message_id, emoji, role_id, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(guildId, messageId, emoji, roleId, Date.now());
    return true;
  } catch (error) {
    logger.error("Failed to add reaction role", { error: error.message });
    return false;
  }
}

function getReactionRoles(messageId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM reaction_roles WHERE message_id = ?
    `);
    
    return stmt.all(messageId);
  } catch (error) {
    logger.error("Failed to get reaction roles", { error: error.message });
    return [];
  }
}

function getRoleIdByReaction(messageId, emoji) {
  try {
    const stmt = db.prepare(`
      SELECT role_id FROM reaction_roles 
      WHERE message_id = ? AND emoji = ?
    `);
    
    const result = stmt.get(messageId, emoji);
    return result?.role_id || null;
  } catch (error) {
    logger.error("Failed to get role by reaction", { error: error.message });
    return null;
  }
}

function giveReactionRole(userId, guildId, roleId) {
  try {
    const stmt = db.prepare(`
      INSERT INTO user_reaction_roles (user_id, guild_id, role_id, obtained_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT DO NOTHING
    `);
    
    stmt.run(userId, guildId, roleId, Date.now());
    return true;
  } catch (error) {
    logger.error("Failed to give reaction role", { error: error.message });
    return false;
  }
}

function removeReactionRole(userId, roleId) {
  try {
    const stmt = db.prepare(`
      DELETE FROM user_reaction_roles 
      WHERE user_id = ? AND role_id = ?
    `);
    
    stmt.run(userId, roleId);
    return true;
  } catch (error) {
    logger.error("Failed to remove reaction role", { error: error.message });
    return false;
  }
}

function hasReactionRole(userId, roleId) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM user_reaction_roles 
      WHERE user_id = ? AND role_id = ?
    `);
    
    return !!stmt.get(userId, roleId);
  } catch (error) {
    logger.error("Failed to check reaction role", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeReactionRoles,
  addReactionRole,
  getReactionRoles,
  getRoleIdByReaction,
  giveReactionRole,
  removeReactionRole,
  hasReactionRole
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
