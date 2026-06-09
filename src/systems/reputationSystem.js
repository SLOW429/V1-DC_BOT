<<<<<<< HEAD
/**
 * Reputation System - Users can give reputation points to others
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize reputation tables
function initializeReputation() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS reputation (
        user_id TEXT PRIMARY KEY,
        points INTEGER NOT NULL DEFAULT 0,
        received_count INTEGER NOT NULL DEFAULT 0,
        given_count INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reputation_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user TEXT NOT NULL,
        to_user TEXT NOT NULL,
        points INTEGER NOT NULL DEFAULT 1,
        reason TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_reputation_points ON reputation(points DESC);
      CREATE INDEX IF NOT EXISTS idx_rep_log_to_user ON reputation_log(to_user);
      CREATE INDEX IF NOT EXISTS idx_rep_log_from_user ON reputation_log(from_user);
    `);
    
    logger.log("Reputation system initialized");
  } catch (error) {
    logger.error("Failed to initialize reputation", { error: error.message });
  }
}

function giveReputation(fromUserId, toUserId, points = 1, reason = "") {
  try {
    // Prevent self-upvoting
    if (fromUserId === toUserId) {
      return { success: false, message: "You can't give reputation to yourself!" };
    }
    
    // Check if user already gave rep today
    const today = Date.now() - (24 * 60 * 60 * 1000);
    const stmt1 = db.prepare(`
      SELECT COUNT(*) as count FROM reputation_log 
      WHERE from_user = ? AND to_user = ? AND created_at > ?
    `);
    const result = stmt1.get(fromUserId, toUserId, today);
    
    if (result.count > 0) {
      return { success: false, message: "You can only give reputation to this user once per day!" };
    }
    
    // Add reputation
    const stmt2 = db.prepare(`
      INSERT INTO reputation (user_id, points, received_count, updated_at)
      VALUES (?, ?, 1, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      points = points + ?,
      received_count = received_count + 1,
      updated_at = ?
    `);
    
    const now = Date.now();
    stmt2.run(toUserId, points, now, points, now);
    
    // Add to log
    const stmt3 = db.prepare(`
      INSERT INTO reputation_log (from_user, to_user, points, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt3.run(fromUserId, toUserId, points, reason.substring(0, 100), now);
    
    // Update given count
    const stmt4 = db.prepare(`
      INSERT INTO reputation (user_id, given_count, updated_at)
      VALUES (?, 1, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      given_count = given_count + 1,
      updated_at = ?
    `);
    
    stmt4.run(fromUserId, now, now);
    
    return { success: true, message: `+${points} reputation given!` };
  } catch (error) {
    logger.error("Failed to give reputation", { error: error.message });
    return { success: false, message: "Error giving reputation" };
  }
}

function getReputation(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM reputation WHERE user_id = ?");
    const result = stmt.get(userId);
    return result || { 
      user_id: userId, 
      points: 0, 
      received_count: 0, 
      given_count: 0 
    };
  } catch (error) {
    logger.error("Failed to get reputation", { error: error.message });
    return null;
  }
}

function getTopReputation(limit = 10) {
  try {
    const stmt = db.prepare(`
      SELECT user_id, points, received_count 
      FROM reputation 
      ORDER BY points DESC 
      LIMIT ?
    `);
    
    return stmt.all(limit);
  } catch (error) {
    logger.error("Failed to get top reputation", { error: error.message });
    return [];
  }
}

function getReputationHistory(userId, limit = 10) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM reputation_log 
      WHERE to_user = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    
    return stmt.all(userId, limit);
  } catch (error) {
    logger.error("Failed to get reputation history", { error: error.message });
    return [];
  }
}

module.exports = {
  initializeReputation,
  giveReputation,
  getReputation,
  getTopReputation,
  getReputationHistory
};
=======
/**
 * Reputation System - Users can give reputation points to others
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize reputation tables
function initializeReputation() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS reputation (
        user_id TEXT PRIMARY KEY,
        points INTEGER NOT NULL DEFAULT 0,
        received_count INTEGER NOT NULL DEFAULT 0,
        given_count INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reputation_log (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        from_user TEXT NOT NULL,
        to_user TEXT NOT NULL,
        points INTEGER NOT NULL DEFAULT 1,
        reason TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_reputation_points ON reputation(points DESC);
      CREATE INDEX IF NOT EXISTS idx_rep_log_to_user ON reputation_log(to_user);
      CREATE INDEX IF NOT EXISTS idx_rep_log_from_user ON reputation_log(from_user);
    `);
    
    logger.log("Reputation system initialized");
  } catch (error) {
    logger.error("Failed to initialize reputation", { error: error.message });
  }
}

function giveReputation(fromUserId, toUserId, points = 1, reason = "") {
  try {
    // Prevent self-upvoting
    if (fromUserId === toUserId) {
      return { success: false, message: "You can't give reputation to yourself!" };
    }
    
    // Check if user already gave rep today
    const today = Date.now() - (24 * 60 * 60 * 1000);
    const stmt1 = db.prepare(`
      SELECT COUNT(*) as count FROM reputation_log 
      WHERE from_user = ? AND to_user = ? AND created_at > ?
    `);
    const result = stmt1.get(fromUserId, toUserId, today);
    
    if (result.count > 0) {
      return { success: false, message: "You can only give reputation to this user once per day!" };
    }
    
    // Add reputation
    const stmt2 = db.prepare(`
      INSERT INTO reputation (user_id, points, received_count, updated_at)
      VALUES (?, ?, 1, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      points = points + ?,
      received_count = received_count + 1,
      updated_at = ?
    `);
    
    const now = Date.now();
    stmt2.run(toUserId, points, now, points, now);
    
    // Add to log
    const stmt3 = db.prepare(`
      INSERT INTO reputation_log (from_user, to_user, points, reason, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt3.run(fromUserId, toUserId, points, reason.substring(0, 100), now);
    
    // Update given count
    const stmt4 = db.prepare(`
      INSERT INTO reputation (user_id, given_count, updated_at)
      VALUES (?, 1, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      given_count = given_count + 1,
      updated_at = ?
    `);
    
    stmt4.run(fromUserId, now, now);
    
    return { success: true, message: `+${points} reputation given!` };
  } catch (error) {
    logger.error("Failed to give reputation", { error: error.message });
    return { success: false, message: "Error giving reputation" };
  }
}

function getReputation(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM reputation WHERE user_id = ?");
    const result = stmt.get(userId);
    return result || { 
      user_id: userId, 
      points: 0, 
      received_count: 0, 
      given_count: 0 
    };
  } catch (error) {
    logger.error("Failed to get reputation", { error: error.message });
    return null;
  }
}

function getTopReputation(limit = 10) {
  try {
    const stmt = db.prepare(`
      SELECT user_id, points, received_count 
      FROM reputation 
      ORDER BY points DESC 
      LIMIT ?
    `);
    
    return stmt.all(limit);
  } catch (error) {
    logger.error("Failed to get top reputation", { error: error.message });
    return [];
  }
}

function getReputationHistory(userId, limit = 10) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM reputation_log 
      WHERE to_user = ? 
      ORDER BY created_at DESC 
      LIMIT ?
    `);
    
    return stmt.all(userId, limit);
  } catch (error) {
    logger.error("Failed to get reputation history", { error: error.message });
    return [];
  }
}

module.exports = {
  initializeReputation,
  giveReputation,
  getReputation,
  getTopReputation,
  getReputationHistory
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
