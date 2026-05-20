require("dotenv").config();

const required = ["BOT_TOKEN", "CLIENT_ID", "GUILD_ID"];

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[CONFIG] Missing required environment variable: ${key}`);
  }
}

module.exports = {
  language: process.env.BOT_LANGUAGE || "ar",
  activity: process.env.BOT_ACTIVITY || "SLOW COMMUNITY",
  activities: (process.env.BOT_ACTIVITIES || "")
    .split("|")
    .map((activity) => activity.trim())
    .filter(Boolean),
  botToken: process.env.BOT_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  channels: {
    welcome: process.env.WELCOME_CHANNEL_ID,
    logs: process.env.LOG_CHANNEL_ID,
    ticketLogs: process.env.TICKET_LOG_CHANNEL_ID || process.env.LOG_CHANNEL_ID
  },
  roles: {
    staff: process.env.STAFF_ROLE_ID,
    auto: process.env.AUTO_ROLE_ID
  },
  tickets: {
    categoryId: process.env.TICKET_CATEGORY_ID
  },
  xp: {
    cooldownSeconds: Number(process.env.XP_COOLDOWN_SECONDS || 60),
    min: Number(process.env.XP_MIN || 15),
    max: Number(process.env.XP_MAX || 25)
  },
  features: {
    antiLink: process.env.ANTI_LINK_ENABLED === "true",
    antiSpam: process.env.ANTI_SPAM_ENABLED !== "false",
    leaveMessages: process.env.LEAVE_MESSAGES_ENABLED !== "false"
  }
};
