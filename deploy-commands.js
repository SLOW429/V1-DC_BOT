require("dotenv").config();

const { REST, Routes } = require("discord.js");
const { loadCommands } = require("./src/handlers/commandHandler");
const config = require("./src/config");

async function deployCommands() {
  const commands = loadCommands().map((command) => command.data.toJSON());
  const rest = new REST({ version: "10" }).setToken(config.botToken);

  try {
    console.log(`Deploying ${commands.length} slash commands...`);

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log("Slash commands deployed successfully.");
  } catch (error) {
    console.error("Failed to deploy slash commands:", error);
    process.exitCode = 1;
  }
}

deployCommands();
