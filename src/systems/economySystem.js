<<<<<<< HEAD
const db = require("../database/db");
const logger = require("../utils/logger");

const defaultShopItems = [
  {
    name: "Lucky Charm",
    description: "A small token that improves your luck in games.",
    price: 500,
    emoji: "\u{1f340}"
  },
  {
    name: "XP Booster",
    description: "Gain more XP from messages for a short time.",
    price: 750,
    emoji: "\u26a1"
  },
  {
    name: "Priority Ticket",
    description: "Get faster support when opening a ticket.",
    price: 1200,
    emoji: "\u{1f39f}"
  }
];

function keyFromName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeBalance(row, userId) {
  return row || { user_id: userId, coins: 0, daily_claimed: 0, updated_at: Date.now() };
}

function initializeEconomy() {
  try {
    db.prepare("SELECT 1 FROM economy LIMIT 1").get();
    db.prepare("SELECT 1 FROM shop_items LIMIT 1").get();
    db.prepare("SELECT 1 FROM inventory LIMIT 1").get();

    const now = Date.now();
    const insert = db.prepare(
      `INSERT INTO shop_items (name, description, price, emoji, created_at)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(name) DO UPDATE SET
         description = excluded.description,
         price = excluded.price,
         emoji = excluded.emoji`
    );

    const seed = db.transaction(() => {
      for (const item of defaultShopItems) {
        insert.run(item.name, item.description, item.price, item.emoji, now);
      }
    });

    seed();
    logger.log("Economy system initialized");
    logger.log("Economy tables verified");
    return true;
  } catch (error) {
    logger.error("Failed to initialize economy system", { error: error.message, stack: error.stack });
    throw error;
  }
}

function addCoins(userId, amount) {
  if (!userId || !Number.isInteger(amount) || amount === 0) return false;

  try {
    const now = Date.now();
    db.prepare(
      `INSERT INTO economy (user_id, coins, updated_at)
       VALUES (?, ?, ?)
       ON CONFLICT(user_id)
       DO UPDATE SET coins = MAX(0, economy.coins + excluded.coins), updated_at = excluded.updated_at`
    ).run(userId, amount, now);
    return true;
  } catch (error) {
    logger.error("Failed to add coins", { error: error.message, userId, amount });
    return false;
  }
}

function removeCoins(userId, amount) {
  if (!userId || !Number.isInteger(amount) || amount <= 0) return false;

  try {
    const result = db
      .prepare("UPDATE economy SET coins = coins - ?, updated_at = ? WHERE user_id = ? AND coins >= ?")
      .run(amount, Date.now(), userId, amount);
    return result.changes > 0;
  } catch (error) {
    logger.error("Failed to remove coins", { error: error.message, userId, amount });
    return false;
  }
}

function getBalance(userId) {
  try {
    return normalizeBalance(db.prepare("SELECT * FROM economy WHERE user_id = ?").get(userId), userId);
  } catch (error) {
    logger.error("Failed to get balance", { error: error.message, userId });
    return normalizeBalance(null, userId);
  }
}

function claimDaily(userId) {
  try {
    const now = Date.now();
    const current = getBalance(userId);
    const cooldownMs = 86400000;

    if (current.daily_claimed && now - current.daily_claimed < cooldownMs) {
      return { success: false, message: "ALREADY_CLAIMED", remaining: cooldownMs - (now - current.daily_claimed) };
    }

    const dailyAmount = 100;
    db.prepare(
      `INSERT INTO economy (user_id, coins, daily_claimed, updated_at)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(user_id)
       DO UPDATE SET
         coins = economy.coins + excluded.coins,
         daily_claimed = excluded.daily_claimed,
         updated_at = excluded.updated_at`
    ).run(userId, dailyAmount, now, now);

    return { success: true, coins: dailyAmount, nextClaim: now + cooldownMs };
  } catch (error) {
    logger.error("Failed to claim daily", { error: error.message, userId });
    return { success: false, message: "ERROR" };
  }
}

function getTopBalances(limit = 10) {
  try {
    return db
      .prepare("SELECT user_id, coins FROM economy ORDER BY coins DESC, updated_at ASC LIMIT ?")
      .all(Math.max(1, Math.min(Number(limit) || 10, 25)));
  } catch (error) {
    logger.error("Failed to get top balances", { error: error.message });
    return [];
  }
}

function getShopItems() {
  try {
    return db
      .prepare("SELECT id, name, description, price, emoji FROM shop_items ORDER BY price ASC, id ASC")
      .all()
      .map((item) => ({ ...item, key: keyFromName(item.name) }));
  } catch (error) {
    logger.error("Failed to get shop items", { error: error.message });
    return [];
  }
}

function findShopItem(keyOrName) {
  const wanted = keyFromName(keyOrName);
  return getShopItems().find((item) => String(item.id) === String(keyOrName) || keyFromName(item.name) === wanted);
}

function getInventory(userId) {
  try {
    return db
      .prepare(
        `SELECT shop_items.name AS item_name, shop_items.emoji, inventory.quantity, inventory.obtained_at
         FROM inventory
         JOIN shop_items ON shop_items.id = inventory.item_id
         WHERE inventory.user_id = ?
         ORDER BY shop_items.name ASC`
      )
      .all(userId);
  } catch (error) {
    logger.error("Failed to get inventory", { error: error.message, userId });
    return [];
  }
}

function buyItem(userId, itemKey) {
  const item = findShopItem(itemKey);
  if (!item) return { success: false, reason: "NOT_FOUND" };

  const balance = getBalance(userId);
  if (balance.coins < item.price) {
    return { success: false, reason: "INSUFFICIENT", missing: item.price - balance.coins };
  }

  try {
    const now = Date.now();
    const transaction = db.transaction(() => {
      const removed = db
        .prepare("UPDATE economy SET coins = coins - ?, updated_at = ? WHERE user_id = ? AND coins >= ?")
        .run(item.price, now, userId, item.price);

      if (removed.changes === 0) {
        throw new Error("Insufficient balance during transaction");
      }

      db.prepare(
        `INSERT INTO inventory (user_id, item_id, quantity, obtained_at)
         VALUES (?, ?, 1, ?)
         ON CONFLICT(user_id, item_id)
         DO UPDATE SET quantity = quantity + 1, obtained_at = excluded.obtained_at`
      ).run(userId, item.id, now);
    });

    transaction();
    return { success: true, item };
  } catch (error) {
    logger.error("Failed to buy item", { error: error.message, userId, itemKey });
    return { success: false, reason: "ERROR" };
  }
}

function work(userId) {
  const reward = Math.floor(Math.random() * 151) + 150;
  return addCoins(userId, reward) ? { success: true, coins: reward } : { success: false, reason: "ERROR" };
}

module.exports = {
  initializeEconomy,
  addCoins,
  removeCoins,
  getBalance,
  claimDaily,
  getTopBalances,
  getShopItems,
  getInventory,
  buyItem,
  work
};
=======
/**
 * Economy System - Users can earn coins and buy items
 */

const db = require("../database/db");
const logger = require("../utils/logger");

// Initialize economy tables
function initializeEconomy() {
  try {
    db.exec(`
      CREATE TABLE IF NOT EXISTS economy (
        user_id TEXT PRIMARY KEY,
        coins INTEGER NOT NULL DEFAULT 0,
        daily_claimed INTEGER NOT NULL DEFAULT 0,
        updated_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS shop_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL UNIQUE,
        description TEXT NOT NULL,
        price INTEGER NOT NULL,
        emoji TEXT NOT NULL,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS inventory (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        item_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL DEFAULT 1,
        obtained_at INTEGER NOT NULL,
        UNIQUE(user_id, item_id)
      );

      CREATE INDEX IF NOT EXISTS idx_economy_coins ON economy(coins);
      CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory(user_id);
    `);
    
    logger.log("Economy system initialized");
  } catch (error) {
    logger.error("Failed to initialize economy", { error: error.message });
  }
}

function addCoins(userId, amount) {
  try {
    const stmt = db.prepare(`
      INSERT INTO economy (user_id, coins, updated_at) 
      VALUES (?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET 
      coins = coins + ?,
      updated_at = ?
    `);
    
    const now = Date.now();
    stmt.run(userId, amount, now, amount, now);
    return true;
  } catch (error) {
    logger.error("Failed to add coins", { error: error.message });
    return false;
  }
}

function removeCoins(userId, amount) {
  try {
    const stmt = db.prepare(`
      UPDATE economy SET coins = coins - ? WHERE user_id = ? AND coins >= ?
    `);
    
    const result = stmt.run(amount, userId, amount);
    return result.changes > 0;
  } catch (error) {
    logger.error("Failed to remove coins", { error: error.message });
    return false;
  }
}

function getCoins(userId) {
  try {
    const stmt = db.prepare("SELECT coins FROM economy WHERE user_id = ?");
    const result = stmt.get(userId);
    return result?.coins || 0;
  } catch (error) {
    logger.error("Failed to get coins", { error: error.message });
    return 0;
  }
}

function getBalance(userId) {
  try {
    const stmt = db.prepare("SELECT * FROM economy WHERE user_id = ?");
    const result = stmt.get(userId);
    return result || { user_id: userId, coins: 0, daily_claimed: 0 };
  } catch (error) {
    logger.error("Failed to get balance", { error: error.message });
    return null;
  }
}

function claimDaily(userId) {
  try {
    const now = Date.now();
    const lastClaimed = db.prepare("SELECT daily_claimed FROM economy WHERE user_id = ?").get(userId)?.daily_claimed || 0;
    
    // Check if 24 hours have passed
    if (now - lastClaimed < 86400000) {
      return { success: false, message: "Already claimed today. Come back in 24 hours!" };
    }
    
    const dailyAmount = 100;
    const stmt = db.prepare(`
      INSERT INTO economy (user_id, coins, daily_claimed, updated_at) 
      VALUES (?, ?, ?, ?)
      ON CONFLICT(user_id) DO UPDATE SET 
      coins = coins + ?,
      daily_claimed = ?,
      updated_at = ?
    `);
    
    stmt.run(userId, dailyAmount, now, now, dailyAmount, now, now);
    return { success: true, coins: dailyAmount };
  } catch (error) {
    logger.error("Failed to claim daily", { error: error.message });
    return { success: false, message: "Error claiming daily reward" };
  }
}

function getTopBalances(limit = 10) {
  try {
    const stmt = db.prepare("SELECT user_id, coins FROM economy ORDER BY coins DESC LIMIT ?");
    return stmt.all(limit);
  } catch (error) {
    logger.error("Failed to get top balances", { error: error.message });
    return [];
  }
}

module.exports = {
  initializeEconomy,
  addCoins,
  removeCoins,
  getCoins,
  getBalance,
  claimDaily,
  getTopBalances
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
