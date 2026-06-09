<<<<<<< HEAD
/**
 * Advanced User Profiles with statistics and achievements
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize profile tables
function initializeProfiles() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        bio TEXT,
        avatar_url TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        requirement INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        user_id TEXT NOT NULL,
        achievement_id INTEGER NOT NULL,
        unlocked_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, achievement_id)
      );

      CREATE TABLE IF NOT EXISTS user_stats (
        user_id TEXT PRIMARY KEY,
        total_messages INTEGER NOT NULL DEFAULT 0,
        total_xp INTEGER NOT NULL DEFAULT 0,
        commands_used INTEGER NOT NULL DEFAULT 0,
        games_played INTEGER NOT NULL DEFAULT 0,
        last_active INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
      CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(total_xp);
    `);
    
    logger.log("Profile system initialized");
  } catch (error) {
    logger.error("Failed to initialize profiles", { error: error.message });
  }
}

function createProfile(userId, username) {
  try {
    const stmt = db.prepare(`
      INSERT INTO profiles (user_id, username, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      username = ?,
      updated_at = ?
    `);
    
    const now = Date.now();
    stmt.run(userId, username, now, now, username, now);
    return true;
  } catch (error) {
    logger.error("Failed to create profile", { error: error.message });
    return false;
  }
}

function getProfile(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM profiles WHERE user_id = ?");
    return stmt.get(userId);
  } catch (error) {
    logger.error("Failed to get profile", { error: error.message });
    return null;
  }
}

function getStats(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM user_stats WHERE user_id = ?");
    const result = stmt.get(userId);
    return result || {
      user_id: userId,
      total_messages: 0,
      total_xp: 0,
      commands_used: 0,
      games_played: 0,
      last_active: Date.now()
    };
  } catch (error) {
    logger.error("Failed to get stats", { error: error.message });
    return null;
  }
}

function updateStats(userId, statType, increment = 1) {
  try {
    const now = Date.now();
    const updateField = `${statType} = ${statType} + ${increment}`;
    
    const stmt = db.prepare(`
      INSERT INTO user_stats (user_id, ${statType}, last_active)
      VALUES (?, ${increment}, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      ${statType} = ${statType} + ${increment},
      last_active = ?
    `);
    
    stmt.run(userId, now, now);
    return true;
  } catch (error) {
    logger.error("Failed to update stats", { error: error.message });
    return false;
  }
}

function getTopProfiles(limit = 10) {
  try {
    const stmt = db.prepare(`
      SELECT p.*, s.total_xp, s.total_messages
      FROM profiles p
      LEFT JOIN user_stats s ON p.user_id = s.user_id
      ORDER BY s.total_xp DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  } catch (error) {
    logger.error("Failed to get top profiles", { error: error.message });
    return [];
  }
}

function setBio(userId, bio) {
  try {
    const stmt = db.prepare(`
      UPDATE profiles SET bio = ?, updated_at = ? WHERE user_id = ?
    `);
    
    stmt.run(bio.substring(0, 200), Date.now(), userId);
    return true;
  } catch (error) {
    logger.error("Failed to set bio", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeProfiles,
  createProfile,
  getProfile,
  getStats,
  updateStats,
  getTopProfiles,
  setBio
};
=======
/**
 * Advanced User Profiles with statistics and achievements
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize profile tables
function initializeProfiles() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS profiles (
        user_id TEXT PRIMARY KEY,
        username TEXT NOT NULL,
        bio TEXT,
        avatar_url TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        icon TEXT NOT NULL,
        requirement INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        user_id TEXT NOT NULL,
        achievement_id INTEGER NOT NULL,
        unlocked_at INTEGER NOT NULL,
        PRIMARY KEY (user_id, achievement_id)
      );

      CREATE TABLE IF NOT EXISTS user_stats (
        user_id TEXT PRIMARY KEY,
        total_messages INTEGER NOT NULL DEFAULT 0,
        total_xp INTEGER NOT NULL DEFAULT 0,
        commands_used INTEGER NOT NULL DEFAULT 0,
        games_played INTEGER NOT NULL DEFAULT 0,
        last_active INTEGER NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
      CREATE INDEX IF NOT EXISTS idx_user_stats_xp ON user_stats(total_xp);
    `);
    
    logger.log("Profile system initialized");
  } catch (error) {
    logger.error("Failed to initialize profiles", { error: error.message });
  }
}

function createProfile(userId, username) {
  try {
    const stmt = db.prepare(`
      INSERT INTO profiles (user_id, username, created_at, updated_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      username = ?,
      updated_at = ?
    `);
    
    const now = Date.now();
    stmt.run(userId, username, now, now, username, now);
    return true;
  } catch (error) {
    logger.error("Failed to create profile", { error: error.message });
    return false;
  }
}

function getProfile(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM profiles WHERE user_id = ?");
    return stmt.get(userId);
  } catch (error) {
    logger.error("Failed to get profile", { error: error.message });
    return null;
  }
}

function getStats(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM user_stats WHERE user_id = ?");
    const result = stmt.get(userId);
    return result || {
      user_id: userId,
      total_messages: 0,
      total_xp: 0,
      commands_used: 0,
      games_played: 0,
      last_active: Date.now()
    };
  } catch (error) {
    logger.error("Failed to get stats", { error: error.message });
    return null;
  }
}

function updateStats(userId, statType, increment = 1) {
  try {
    const now = Date.now();
    const updateField = `${statType} = ${statType} + ${increment}`;
    
    const stmt = db.prepare(`
      INSERT INTO user_stats (user_id, ${statType}, last_active)
      VALUES (?, ${increment}, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      ${statType} = ${statType} + ${increment},
      last_active = ?
    `);
    
    stmt.run(userId, now, now);
    return true;
  } catch (error) {
    logger.error("Failed to update stats", { error: error.message });
    return false;
  }
}

function getTopProfiles(limit = 10) {
  try {
    const stmt = db.prepare(`
      SELECT p.*, s.total_xp, s.total_messages
      FROM profiles p
      LEFT JOIN user_stats s ON p.user_id = s.user_id
      ORDER BY s.total_xp DESC
      LIMIT ?
    `);
    
    return stmt.all(limit);
  } catch (error) {
    logger.error("Failed to get top profiles", { error: error.message });
    return [];
  }
}

function setBio(userId, bio) {
  try {
    const stmt = db.prepare(`
      UPDATE profiles SET bio = ?, updated_at = ? WHERE user_id = ?
    `);
    
    stmt.run(bio.substring(0, 200), Date.now(), userId);
    return true;
  } catch (error) {
    logger.error("Failed to set bio", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeProfiles,
  createProfile,
  getProfile,
  getStats,
  updateStats,
  getTopProfiles,
  setBio
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
