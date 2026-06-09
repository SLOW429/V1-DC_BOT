const { Events } = require("discord.js");
const musicSystem = require("../systems/musicSystem");
const logger = require("../utils/logger");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    try {
      if (oldState.member?.user?.bot && newState.member?.user?.bot) return;
      await Promise.resolve(musicSystem.handleVoiceStateUpdate(oldState, newState));
    } catch (error) {
      logger.error("voiceStateUpdate error", { error: error.message, stack: error.stack });
    }
  }
};
