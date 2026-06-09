const path = require("path");
const fs = require("fs");
const logger = require("../utils/logger");

function loadEvents(client) {
  const eventsPath = path.join(__dirname, "..", "events");
  let loadedCount = 0;

  for (const file of fs.readdirSync(eventsPath).filter((name) => name.endsWith(".js"))) {
    try {
      const event = require(path.join(eventsPath, file));
      if (!event.name || !event.execute) {
        logger.warn(`Invalid event structure in ${file}`, {
          hasName: !!event.name,
          hasExecute: !!event.execute
        });
        continue;
      }

<<<<<<< HEAD
      const runEvent = async (...args) => {
        try {
          await Promise.resolve(event.execute(...args, client));
        } catch (error) {
          logger.error(`Error in event ${event.name}`, { error: error.message, stack: error.stack });
        }
      };

      if (event.once) {
        client.once(event.name, (...args) => {
          void runEvent(...args);
        });
      } else {
        client.on(event.name, (...args) => {
          void runEvent(...args);
=======
      if (event.once) {
        client.once(event.name, (...args) => {
          try {
            event.execute(...args, client);
          } catch (error) {
            logger.error(`Error in event ${event.name}`, { error: error.message });
          }
        });
      } else {
        client.on(event.name, (...args) => {
          try {
            event.execute(...args, client);
          } catch (error) {
            logger.error(`Error in event ${event.name}`, { error: error.message });
          }
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
        });
      }
      loadedCount++;
    } catch (error) {
      logger.error(`Failed to load event from ${file}`, { error: error.message });
    }
  }

  logger.log(`Loaded ${loadedCount} events`);
}

module.exports = { loadEvents };
