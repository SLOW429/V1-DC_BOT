const { Events } = require("discord.js");
const { sendLog } = require("../systems/logSystem");
const { colors } = require("../utils/embedBuilder");

module.exports = {
  name: Events.MessageDelete,
  async execute(message) {
    try {
      if (!message.guild || message.author?.bot) return;

      await sendLog(message.guild, {
        title: "Message Deleted",
        description: `A message was deleted in ${message.channel}.`,
        color: colors.danger,
        fields: [
          { name: "Author", value: message.author ? `${message.author.tag}` : "Unknown", inline: true },
          { name: "Content", value: message.content?.slice(0, 1024) || "No text content", inline: false }
        ]
      });
    } catch (error) {
      console.error("messageDelete error:", error);
    }
  }
};
