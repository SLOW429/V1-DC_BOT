const { Client, Collection, Events, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const { registerAntiCrash } = require("./utils/errorHandler");
const logger = require("./utils/logger");
const { loadCommands } = require("./handlers/commandHandler");
<<<<<<< HEAD
const { loadPrefixCommands } = require("./handlers/prefixCommandHandler");
const { loadEvents } = require("./handlers/eventHandler");
const { startPresenceRotation } = require("./systems/presenceSystem");
const { initializeEconomy } = require("./systems/economySystem");
const musicSystem = require("./systems/musicSystem");
const db = require("./database/db");
const cooldownManager = require("./utils/cooldownManager");

registerAntiCrash();

try {
  initializeEconomy();
=======
const { loadEvents } = require("./handlers/eventHandler");
const { startPresenceRotation } = require("./systems/presenceSystem");
const cooldownManager = require("./utils/cooldownManager");

try {
  require("./database/db");
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
} catch (error) {
  logger.error("Failed to load database", { error: error.message });
  process.exit(1);
}

<<<<<<< HEAD
=======
registerAntiCrash();

>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
<<<<<<< HEAD
    GatewayIntentBits.GuildVoiceStates,
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
});

client.commands = new Collection();
<<<<<<< HEAD
client.prefixCommands = new Collection();
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
client.buttons = new Collection();
client.selectMenus = new Collection();

try {
  for (const command of loadCommands()) {
    client.commands.set(command.data.name, command);
  }
<<<<<<< HEAD
  logger.log(`Loaded ${client.commands.size} slash commands`);
=======
  logger.log(`Loaded ${client.commands.size} commands`);
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
} catch (error) {
  logger.error("Failed to load commands", { error: error.message });
  process.exit(1);
}

try {
<<<<<<< HEAD
  for (const [name, command] of loadPrefixCommands()) {
    client.prefixCommands.set(name, command);
  }
  logger.log(`Loaded ${client.prefixCommands.size} prefix commands`);
} catch (error) {
  logger.error("Failed to load prefix commands", { error: error.message });
  process.exit(1);
}

try {
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  loadEvents(client);
} catch (error) {
  logger.error("Failed to load events", { error: error.message });
  process.exit(1);
}

<<<<<<< HEAD
client.once(Events.ClientReady, async () => {
  logger.success(`Bot logged in as ${client.user.tag}`);
  logger.log(`Operating in ${client.guilds.cache.size} guild(s)`);
  startPresenceRotation(client);

  try {
    await musicSystem.autoJoinConfiguredVoice(client);
  } catch (error) {
    logger.warn("Voice auto join startup task failed", { error: error.message });
  }
=======
client.once(Events.ClientReady, () => {
  logger.success(`Bot logged in as ${client.user.tag}`);
  logger.log(`Operating in ${client.guilds.cache.size} guild(s)`);
  startPresenceRotation(client);
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
});

client.on("error", (error) => {
  logger.error("Discord client error", { error: error.message });
});

client.on("warn", (warning) => {
  logger.warn("Discord warning", { warning });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  logger.log("Received SIGINT, shutting down gracefully...");
  cooldownManager.stopCleanup();
<<<<<<< HEAD
  musicSystem.destroyAll();
  db.closeGracefully();
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  try {
    await client.destroy();
    logger.log("Bot disconnected");
  } catch (error) {
    logger.error("Error during shutdown", { error: error.message });
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  logger.log("Received SIGTERM, shutting down gracefully...");
  cooldownManager.stopCleanup();
<<<<<<< HEAD
  musicSystem.destroyAll();
  db.closeGracefully();
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  try {
    await client.destroy();
    logger.log("Bot disconnected");
  } catch (error) {
    logger.error("Error during shutdown", { error: error.message });
  }
  process.exit(0);
});

client.login(config.botToken).catch((error) => {
  logger.error("Failed to login", { error: error.message });
  process.exit(1);
});
