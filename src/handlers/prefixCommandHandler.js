const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

function loadPrefixCommands() {
  const commands = new Map();
  const commandsPath = path.join(__dirname, "..", "prefix");

  if (!fs.existsSync(commandsPath)) {
    logger.warn("Prefix commands directory does not exist", { path: commandsPath });
    logger.log("Loaded 0 prefix commands");
    return commands;
  }

  function registerName(name, command, source) {
    const normalized = String(name || "").toLowerCase();
    if (!normalized) return;

    if (commands.has(normalized)) {
      logger.warn("Duplicate prefix command or alias skipped", { name: normalized, source });
      return;
    }

    commands.set(normalized, command);
  }

  function walk(directory) {
    for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
      const fullPath = path.join(directory, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!item.name.endsWith(".js") || item.name.startsWith("_")) continue;

      try {
        delete require.cache[require.resolve(fullPath)];
        const command = require(fullPath);
        if (!command.name || typeof command.execute !== "function") {
          logger.warn("Invalid prefix command structure", { file: fullPath });
          continue;
        }

        registerName(command.name, command, fullPath);
        for (const alias of command.aliases || []) {
          registerName(alias, command, fullPath);
        }
      } catch (error) {
        logger.error("Failed to load prefix command", { file: fullPath, error: error.message });
      }
    }
  }

  walk(commandsPath);
  logger.log(`Loaded ${commands.size} prefix commands`);
  return commands;
}

module.exports = { loadPrefixCommands };
