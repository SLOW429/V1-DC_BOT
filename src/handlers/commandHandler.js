const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

function loadCommands() {
  const commands = [];
  const commandsPath = path.join(__dirname, "..", "commands");

  function walk(dir) {
    for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
      const fullPath = path.join(dir, item.name);
      if (item.isDirectory()) {
        walk(fullPath);
        continue;
      }
      if (!item.name.endsWith(".js")) continue;

      try {
        const command = require(fullPath);
<<<<<<< HEAD
        if (command.prefix === true) {
          continue;
        }

        if (command.data && typeof command.data.toJSON === "function" && command.execute) {
=======
        if (command.data && command.execute) {
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
          commands.push(command);
        } else {
          logger.warn(`Invalid command structure in ${fullPath}`, {
            hasData: !!command.data,
            hasExecute: !!command.execute
          });
        }
      } catch (error) {
        logger.error(`Failed to load command from ${fullPath}`, { error: error.message });
      }
    }
  }

  walk(commandsPath);
  return commands;
}

module.exports = { loadCommands };
