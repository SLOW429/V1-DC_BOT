const config = require("../config");
const { logEmbed, colors } = require("../utils/embedBuilder");

async function sendLog(guild, { title, description, fields = [], color = colors.neutral }) {
  try {
    const channelId = config.channels.logs;
    if (!channelId || !guild) return null;

    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return null;

    const embed = logEmbed(title, description).setColor(color);
    if (fields.length) embed.addFields(fields);

    return channel.send({ embeds: [embed] });
  } catch (error) {
    console.error("Failed to send log:", error);
    return null;
  }
}

async function sendTicketLog(guild, payload) {
  try {
    const channelId = config.channels.ticketLogs;
    if (!channelId || !guild) return null;

    const channel = await guild.channels.fetch(channelId).catch(() => null);
    if (!channel || !channel.isTextBased()) return null;

    const embed = logEmbed(payload.title, payload.description).setColor(payload.color || colors.primary);
    if (payload.fields?.length) embed.addFields(payload.fields);

    return channel.send({ embeds: [embed], files: payload.files || [] });
  } catch (error) {
    console.error("Failed to send ticket log:", error);
    return null;
  }
}

module.exports = {
  sendLog,
  sendTicketLog
};
