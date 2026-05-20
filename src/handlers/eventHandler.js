const path = require("path");
const fs = require("fs");

function loadEvents(client) {
  const eventsPath = path.join(__dirname, "..", "events");

  for (const file of fs.readdirSync(eventsPath).filter((name) => name.endsWith(".js"))) {
    const event = require(path.join(eventsPath, file));
    if (!event.name || !event.execute) continue;

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args, client));
    } else {
      client.on(event.name, (...args) => event.execute(...args, client));
    }
  }
}

module.exports = { loadEvents };
