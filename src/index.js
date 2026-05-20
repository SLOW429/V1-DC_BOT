const { Client, Collection, Events, GatewayIntentBits, Partials } = require("discord.js");
const config = require("./config");
const { registerAntiCrash } = require("./utils/errorHandler");
const { loadCommands } = require("./handlers/commandHandler");
const { loadEvents } = require("./handlers/eventHandler");
const { startPresenceRotation } = require("./systems/presenceSystem");
require("./database/db");

registerAntiCrash();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildModeration,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.GuildMember, Partials.User]
});

client.commands = new Collection();
client.cooldowns = new Collection();
client.buttons = new Collection();
client.selectMenus = new Collection();

for (const command of loadCommands()) {
  client.commands.set(command.data.name, command);
}

loadEvents(client);

client.once(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user.tag}`);
  startPresenceRotation(client);
});

client.login(config.botToken);
