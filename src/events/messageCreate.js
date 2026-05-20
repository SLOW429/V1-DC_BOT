const { Events } = require("discord.js");
const { addMessageXp } = require("../systems/xpSystem");
const { runProtections } = require("../systems/protectionSystem");

module.exports = {
  name: Events.MessageCreate,
  async execute(message) {
    try {
      const blocked = await runProtections(message);
      if (!blocked) await addMessageXp(message);
    } catch (error) {
      console.error("messageCreate error:", error);
    }
  }
};
