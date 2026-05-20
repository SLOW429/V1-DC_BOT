function registerAntiCrash() {
  process.on("unhandledRejection", (reason) => {
    console.error("[UNHANDLED_REJECTION]", reason);
  });

  process.on("uncaughtException", (error) => {
    console.error("[UNCAUGHT_EXCEPTION]", error);
  });

  process.on("warning", (warning) => {
    console.warn("[PROCESS_WARNING]", warning);
  });
}

async function safeReply(interaction, payload) {
  try {
    if (interaction.deferred || interaction.replied) {
      return interaction.editReply(payload);
    }
    return interaction.reply(payload);
  } catch (error) {
    console.error("Failed to reply to interaction:", error);
    return null;
  }
}

module.exports = {
  registerAntiCrash,
  safeReply
};
