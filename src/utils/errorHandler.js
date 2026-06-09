const logger = require("./logger");

let antiCrashRegistered = false;

function registerAntiCrash() {
  if (antiCrashRegistered) return;
  antiCrashRegistered = true;

  process.on("unhandledRejection", (reason) => {
    logger.error("Unhandled Promise Rejection", {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    });
  });

  process.on("uncaughtException", (error) => {
    logger.error("Uncaught Exception", {
      message: error.message,
      stack: error.stack
    });
    // Exit after logging uncaught exception
    process.exit(1);
  });

  process.on("warning", (warning) => {
    logger.warn("Process Warning", {
      name: warning.name,
      message: warning.message
    });
  });
}

async function safeReply(interaction, payload) {
  try {
    if (!interaction.isRepliable()) {
      logger.warn("Interaction is not repliable", { interaction: interaction.id });
      return null;
    }

    // Ensure payload is valid
    if (!payload) {
      logger.warn("No payload provided for reply", { interaction: interaction.id });
      return null;
    }

    if (interaction.deferred || interaction.replied) {
      return await interaction.editReply(payload);
    }
    return await interaction.reply(payload);
  } catch (error) {
    logger.error("Failed to reply to interaction", { 
      error: error.message,
      interaction: interaction.id 
    });
    return null;
  }
}

module.exports = {
  registerAntiCrash,
  safeReply
};
