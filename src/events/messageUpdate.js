const { Events } = require("discord.js");
const { sendLog } = require("../systems/logSystem");
const { colors } = require("../utils/embedBuilder");

module.exports = {
  name: Events.MessageUpdate,
  async execute(oldMessage, newMessage) {
    try {
      if (!newMessage.guild || newMessage.author?.bot) return;
      if (oldMessage.content === newMessage.content) return;

      await sendLog(newMessage.guild, {
        title: "Message Edited",
        description: `A message was edited in ${newMessage.channel}.`,
        color: colors.warning,
        fields: [
          { name: "Author", value: newMessage.author ? `${newMessage.author.tag}` : "Unknown", inline: true },
          { name: "Before", value: oldMessage.content?.slice(0, 1024) || "Unknown", inline: false },
          { name: "After", value: newMessage.content?.slice(0, 1024) || "Unknown", inline: false }
        ]
      });
    } catch (error) {
      console.error("messageUpdate error:", error);
    }
  }
};
