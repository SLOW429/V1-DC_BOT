const path = require("path");
const fs = require("fs");
const Database = require("better-sqlite3");
const logger = require("../utils/logger");

try {
  const dataDir = path.join(process.cwd(), "data");
<<<<<<< HEAD
  fs.mkdirSync(dataDir, { recursive: true });
=======
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e

  const db = new Database(path.join(dataDir, "database.sqlite"));
  db.pragma("journal_mode = WAL");
  db.pragma("synchronous = NORMAL");
<<<<<<< HEAD
  db.pragma("foreign_keys = ON");

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
      FOREIGN KEY (item_id) REFERENCES shop_items(id) ON DELETE CASCADE,
      UNIQUE(user_id, item_id)
    );

    CREATE TABLE IF NOT EXISTS music_queue (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      url TEXT NOT NULL,
      title TEXT NOT NULL,
      requested_by TEXT NOT NULL,
      position INTEGER NOT NULL,
      created_at INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS xp (
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      xp INTEGER NOT NULL DEFAULT 0,
      level INTEGER NOT NULL DEFAULT 0,
      messages INTEGER NOT NULL DEFAULT 0,
      updated_at INTEGER NOT NULL DEFAULT 0,
      PRIMARY KEY (guild_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS warnings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      guild_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      moderator_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      created_at INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS tickets (
      channel_id TEXT PRIMARY KEY,
      guild_id TEXT NOT NULL,
      owner_id TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'open',
      claimed_by TEXT,
      created_at INTEGER NOT NULL,
      closed_at INTEGER
    );
  `);

  const musicColumns = db.prepare("PRAGMA table_info(music_queue)").all().map((column) => column.name);
  if (!musicColumns.includes("created_at")) {
    db.exec("ALTER TABLE music_queue ADD COLUMN created_at INTEGER NOT NULL DEFAULT 0");
  }

  db.exec(`
    CREATE INDEX IF NOT EXISTS idx_economy_coins ON economy(coins);
    CREATE INDEX IF NOT EXISTS idx_inventory_user ON inventory(user_id);
    CREATE INDEX IF NOT EXISTS idx_music_queue_guild ON music_queue(guild_id);
    CREATE INDEX IF NOT EXISTS idx_music_queue_position ON music_queue(guild_id, position);
    CREATE INDEX IF NOT EXISTS idx_xp_guild ON xp(guild_id);
    CREATE INDEX IF NOT EXISTS idx_xp_user ON xp(user_id);
    CREATE INDEX IF NOT EXISTS idx_xp_level ON xp(level DESC);
    CREATE INDEX IF NOT EXISTS idx_warnings_guild ON warnings(guild_id);
    CREATE INDEX IF NOT EXISTS idx_warnings_user ON warnings(user_id);
    CREATE INDEX IF NOT EXISTS idx_warnings_created ON warnings(created_at DESC);
    CREATE INDEX IF NOT EXISTS idx_tickets_guild ON tickets(guild_id);
    CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
    CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(owner_id);
    CREATE INDEX IF NOT EXISTS idx_inventory_item ON inventory(item_id);
    CREATE INDEX IF NOT EXISTS idx_shop_items_price ON shop_items(price);
  `);

  db.closeGracefully = () => {
    try {
      if (db.open) {
        db.close();
        logger.log("Database connection closed");
      }
    } catch (error) {
      logger.error("Error closing database", { error: error.message });
    }
  };

  logger.log("Database initialized successfully");
  logger.log("All tables created");
  logger.log("Indexes created");

  module.exports = db;
} catch (error) {
  logger.error("Failed to initialize database", { error: error.message, stack: error.stack });
=======

  db.exec(`
  CREATE TABLE IF NOT EXISTS xp (
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    xp INTEGER NOT NULL DEFAULT 0,
    level INTEGER NOT NULL DEFAULT 0,
    messages INTEGER NOT NULL DEFAULT 0,
    updated_at INTEGER NOT NULL,
    PRIMARY KEY (guild_id, user_id)
  );

  CREATE TABLE IF NOT EXISTS warnings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    guild_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    moderator_id TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS tickets (
    channel_id TEXT PRIMARY KEY,
    guild_id TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    claimed_by TEXT,
    status TEXT NOT NULL DEFAULT 'open',
    created_at INTEGER NOT NULL,
    closed_at INTEGER
  );
  `);

  // Create indexes for better query performance
  db.exec(`
  CREATE INDEX IF NOT EXISTS idx_xp_guild ON xp(guild_id);
  CREATE INDEX IF NOT EXISTS idx_xp_user ON xp(user_id);
  CREATE INDEX IF NOT EXISTS idx_warnings_guild ON warnings(guild_id);
  CREATE INDEX IF NOT EXISTS idx_warnings_user ON warnings(user_id);
  CREATE INDEX IF NOT EXISTS idx_warnings_created ON warnings(created_at);
  CREATE INDEX IF NOT EXISTS idx_tickets_guild ON tickets(guild_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_owner ON tickets(owner_id);
  CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
  `);

  logger.log("Database initialized successfully");

  // Close database on process exit
  process.on("SIGINT", () => {
    try {
      db.close();
      logger.log("Database connection closed");
    } catch (error) {
      logger.error("Error closing database", { error: error.message });
    }
  });

  process.on("SIGTERM", () => {
    try {
      db.close();
      logger.log("Database connection closed");
    } catch (error) {
      logger.error("Error closing database", { error: error.message });
    }
  });

  module.exports = db;
} catch (error) {
  logger.error("Failed to initialize database", { error: error.message });
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  process.exit(1);
}
