require("dotenv").config();

const required = ["BOT_TOKEN", "CLIENT_ID", "GUILD_ID"];
<<<<<<< HEAD
const missing = required.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(`\nMissing required environment variables: ${missing.join(", ")}`);
  console.error("Please copy .env.example to .env and fill in the required values.\n");
=======
const missing = [];

for (const key of required) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error(`\n❌ Missing required environment variables: ${missing.join(", ")}`);
  console.error("Please copy .env.example to .env and fill in the required values\n");
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  process.exit(1);
}

module.exports = {
  language: process.env.BOT_LANGUAGE || "ar",
<<<<<<< HEAD
  commandPrefix: process.env.BOT_PREFIX || "--",
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
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
<<<<<<< HEAD
  owner: {
    id: process.env.OWNER_ID || "",
    strikethroughGif:
      process.env.OWNER_STRIKETHROUGH_GIF || "https://media.giphy.com/media/3o7TKU8J0jZw0bPt0c/giphy.gif",
    arabicSendCommand: process.env.OWNER_ARABIC_SEND_COMMAND || "\u0627\u0628\u0639\u062a \u0627\u0644\u0631\u0633\u0627\u0644\u0647 \u062f\u064a"
  },
  music: {
    voiceChannelId: process.env.MUSIC_VOICE_CHANNEL_ID || "1513980441231757485",
    autoDisconnectMs: Number(process.env.MUSIC_AUTO_DISCONNECT_MS || 300000)
  },
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
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
