<<<<<<< HEAD
/**
 * Birthday System - Track and celebrate member birthdays
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize birthday tables
function initializeBirthdays() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS birthdays (
        user_id TEXT PRIMARY KEY,
        month INTEGER NOT NULL,
        day INTEGER NOT NULL,
        year INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS birthday_celebrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        celebrator_id TEXT NOT NULL,
        celebrated_at INTEGER NOT NULL,
        message TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_birthdays_month_day ON birthdays(month, day);
      CREATE INDEX IF NOT EXISTS idx_celebrations_user ON birthday_celebrations(user_id);
    `);
    
    logger.log("Birthday system initialized");
  } catch (error) {
    logger.error("Failed to initialize birthdays", { error: error.message });
  }
}

function setBirthday(userId, month, day, year = null) {
  try {
    // Validate month and day
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return { success: false, message: "Invalid date" };
    }
    
    const stmt = db.prepare(`
      INSERT INTO birthdays (user_id, month, day, year, created_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      month = ?,
      day = ?,
      year = ?
    `);
    
    const now = Date.now();
    stmt.run(userId, month, day, year, now, month, day, year);
    return { success: true, message: "Birthday set!" };
  } catch (error) {
    logger.error("Failed to set birthday", { error: error.message });
    return { success: false, message: "Error setting birthday" };
  }
}

function getBirthday(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM birthdays WHERE user_id = ?");
    return stmt.get(userId);
  } catch (error) {
    logger.error("Failed to get birthday", { error: error.message });
    return null;
  }
}

function getTodayBirthdays() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const stmt = db.prepare(`
      SELECT * FROM birthdays WHERE month = ? AND day = ?
    `);
    
    return stmt.all(month, day);
  } catch (error) {
    logger.error("Failed to get today birthdays", { error: error.message });
    return [];
  }
}

function getUpcomingBirthdays(days = 7) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM birthdays 
      ORDER BY month ASC, day ASC
      LIMIT ?
    `);
    
    return stmt.all(days);
  } catch (error) {
    logger.error("Failed to get upcoming birthdays", { error: error.message });
    return [];
  }
}

function celebrateBirthday(userId, celebratorId, message = "") {
  try {
    const stmt = db.prepare(`
      INSERT INTO birthday_celebrations (user_id, celebrator_id, celebrated_at, message)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(userId, celebratorId, Date.now(), message.substring(0, 200));
    return true;
  } catch (error) {
    logger.error("Failed to celebrate birthday", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeBirthdays,
  setBirthday,
  getBirthday,
  getTodayBirthdays,
  getUpcomingBirthdays,
  celebrateBirthday
};
=======
/**
 * Birthday System - Track and celebrate member birthdays
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize birthday tables
function initializeBirthdays() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS birthdays (
        user_id TEXT PRIMARY KEY,
        month INTEGER NOT NULL,
        day INTEGER NOT NULL,
        year INTEGER,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS birthday_celebrations (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        celebrator_id TEXT NOT NULL,
        celebrated_at INTEGER NOT NULL,
        message TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_birthdays_month_day ON birthdays(month, day);
      CREATE INDEX IF NOT EXISTS idx_celebrations_user ON birthday_celebrations(user_id);
    `);
    
    logger.log("Birthday system initialized");
  } catch (error) {
    logger.error("Failed to initialize birthdays", { error: error.message });
  }
}

function setBirthday(userId, month, day, year = null) {
  try {
    // Validate month and day
    if (month < 1 || month > 12 || day < 1 || day > 31) {
      return { success: false, message: "Invalid date" };
    }
    
    const stmt = db.prepare(`
      INSERT INTO birthdays (user_id, month, day, year, created_at)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET
      month = ?,
      day = ?,
      year = ?
    `);
    
    const now = Date.now();
    stmt.run(userId, month, day, year, now, month, day, year);
    return { success: true, message: "Birthday set!" };
  } catch (error) {
    logger.error("Failed to set birthday", { error: error.message });
    return { success: false, message: "Error setting birthday" };
  }
}

function getBirthday(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM birthdays WHERE user_id = ?");
    return stmt.get(userId);
  } catch (error) {
    logger.error("Failed to get birthday", { error: error.message });
    return null;
  }
}

function getTodayBirthdays() {
  try {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    
    const stmt = db.prepare(`
      SELECT * FROM birthdays WHERE month = ? AND day = ?
    `);
    
    return stmt.all(month, day);
  } catch (error) {
    logger.error("Failed to get today birthdays", { error: error.message });
    return [];
  }
}

function getUpcomingBirthdays(days = 7) {
  try {
    const stmt = db.prepare(`
      SELECT * FROM birthdays 
      ORDER BY month ASC, day ASC
      LIMIT ?
    `);
    
    return stmt.all(days);
  } catch (error) {
    logger.error("Failed to get upcoming birthdays", { error: error.message });
    return [];
  }
}

function celebrateBirthday(userId, celebratorId, message = "") {
  try {
    const stmt = db.prepare(`
      INSERT INTO birthday_celebrations (user_id, celebrator_id, celebrated_at, message)
      VALUES (?, ?, ?, ?)
    `);
    
    stmt.run(userId, celebratorId, Date.now(), message.substring(0, 200));
    return true;
  } catch (error) {
    logger.error("Failed to celebrate birthday", { error: error.message });
    return false;
  }
}

module.exports = {
  initializeBirthdays,
  setBirthday,
  getBirthday,
  getTodayBirthdays,
  getUpcomingBirthdays,
  celebrateBirthday
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
