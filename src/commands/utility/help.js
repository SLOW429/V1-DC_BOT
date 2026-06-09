const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

const COMMAND_CATEGORIES = {
  admin: {
    name: "🔐 Admin",
    commands: [
      { name: "/ban", desc: "Ban a member from the server" },
      { name: "/kick", desc: "Kick a member from the server" },
      { name: "/timeout", desc: "Timeout a member temporarily" },
      { name: "/clear", desc: "Clear messages from a channel" },
      { name: "/warn", desc: "Warn a member (requires reason)" },
      { name: "/warnings", desc: "Check warnings for a member" }
    ]
  },
  xp: {
    name: "⭐ Leveling",
    commands: [
      { name: "/rank", desc: "Check your current rank and XP" },
      { name: "/leaderboard", desc: "View the server leaderboard" }
    ]
  },
  tickets: {
    name: "🎫 Support Tickets",
    commands: [
      { name: "/ticket-setup", desc: "Set up the ticket system" }
    ]
  },
  games: {
    name: "🎮 Games",
    commands: [
      { name: "/coinflip", desc: "Flip a coin" },
      { name: "/dice", desc: "Roll a dice" },
      { name: "/8ball", desc: "Ask the magic 8-ball" },
      { name: "/rps", desc: "Play rock, paper, scissors" },
      { name: "/slots", desc: "Play the slot machine" },
      { name: "/trivia", desc: "Answer trivia questions" }
    ]
  },
  utility: {
    name: "🛠️ Utility",
    commands: [
      { name: "/ping", desc: "Check bot latency" },
      { name: "/serverinfo", desc: "Get server information" },
      { name: "/userinfo", desc: "Get user information" },
      { name: "/avatar", desc: "View user avatar" },
      { name: "/help", desc: "Show this help message" }
    ]
  }
};

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show detailed bot command information."),
  async execute(interaction) {
    const embed = baseEmbed({
      title: "📖 Bot Help & Commands",
      description: "Here are all available bot commands. Use the category buttons to navigate.",
      color: colors.primary
    });

    for (const [key, category] of Object.entries(COMMAND_CATEGORIES)) {
      const commandList = category.commands
        .map(cmd => `${cmd.name} - ${cmd.desc}`)
        .join("\n");
      
      embed.addFields({
        name: category.name,
        value: commandList || "No commands available",
        inline: false
      });
    }

    embed.addFields({
      name: "📝 Tips",
      value: "• All commands support slash command autocomplete\n• Use `/ping` to check bot latency\n• Need help? Contact server staff",
      inline: false
    });

    return interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};
