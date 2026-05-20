const path = require("path");
const fs = require("fs");

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

      const command = require(fullPath);
      if (command.data && command.execute) {
        commands.push(command);
      }
    }
  }

  walk(commandsPath);
  return commands;
}

module.exports = { loadCommands };
