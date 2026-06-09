<<<<<<< HEAD
# 👨‍💻 Developer Guide

## Overview

This guide helps you understand the bot architecture and extend it with new features.

---

## 🏗️ Architecture

### Directory Structure
```
src/
├── commands/           # Slash commands organized by category
│   ├── admin/         # Moderation commands
│   ├── fun/           # Game commands
│   ├── tickets/       # Ticket system
│   ├── utility/       # Utility commands
│   └── xp/            # Leveling commands
├── database/          # Database initialization and schema
├── events/            # Discord.js event handlers
├── handlers/          # Command/event loading and routing
├── systems/           # Business logic systems
│   ├── gameSystem.js
│   ├── logSystem.js
│   ├── moderationSystem.js
│   ├── presenceSystem.js
│   ├── protectionSystem.js
│   ├── ticketSystem.js
│   └── xpSystem.js
├── utils/             # Shared utilities
│   ├── embedBuilder.js
│   ├── errorHandler.js
│   ├── i18n.js       # Internationalization
│   ├── logger.js     # Structured logging (NEW)
│   ├── permissions.js
│   ├── validation.js (NEW)
│   └── cooldownManager.js (NEW)
├── config.js          # Configuration management
└── index.js           # Entry point
```

---

## 📝 Creating Commands

### Basic Command Template

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { successEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 3, // Cooldown in seconds (optional, default 3)
  data: new SlashCommandBuilder()
    .setName("commandname")
    .setDescription("Command description")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    // Add options below
    .addStringOption((option) => 
      option.setName("arg").setDescription("Argument").setRequired(true)
    ),
  
  async execute(interaction) {
    try {
      const arg = interaction.options.getString("arg");

      // Your command logic here
      logger.log("Command executed", { command: "commandname", user: interaction.user.id });

      return interaction.reply({
        embeds: [successEmbed("Success", "Operation completed")]
      });
    } catch (error) {
      logger.error("Command error", { error: error.message });
      return interaction.reply({
        embeds: [errorEmbed("Error", "Something went wrong")],
        ephemeral: true
      });
    }
  }
};
```

### Command Structure
- **cooldown** (number) - Cooldown in seconds
- **data** (SlashCommandBuilder) - Command definition
- **execute** (async function) - Command handler

### Best Practices
1. Always wrap in try-catch
2. Use the logger for debugging
3. Use validation utilities for inputs
4. Return ephemeral replies for errors
5. Check permissions before executing

---

## 🔗 Creating Events

### Basic Event Template

```javascript
const { Events } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
  name: Events.MessageCreate, // Discord.js event name
  async execute(message, client) {
    try {
      if (message.author.bot) return;
      
      // Your event logic here
      logger.log("Event triggered", { event: "messageCreate", user: message.author.id });
    } catch (error) {
      logger.error("Event error", { error: error.message });
    }
  }
};
```

### Event Structure
- **name** (string) - Discord.js event name
- **once** (boolean, optional) - If true, event fires only once
- **execute** (async function) - Event handler

### Available Events
- `ready` - Bot connects and is ready
- `messageCreate` - User sends a message
- `interactionCreate` - User uses a button/select/command
- `guildMemberAdd` - Member joins server
- `guildMemberRemove` - Member leaves server
- `messageDelete` - Message is deleted
- `messageUpdate` - Message is edited

---

## 🛠️ Using Utilities

### Logger
```javascript
const logger = require("../utils/logger");

logger.log("Info message");
logger.success("Operation successful");
logger.warn("Warning message");
logger.error("Error message", { context: "additional data" });
logger.debug("Debug message"); // Only if DEBUG=true
```

### Validation
```javascript
const { 
  isValidUserId, 
  validateString, 
  validateInteger 
} = require("../utils/validation");

if (!isValidUserId(userId)) {
  return error("Invalid user ID");
}

if (!validateString(text, 1, 100)) {
  return error("Text must be 1-100 characters");
}

if (!validateInteger(level, 1, 10)) {
  return error("Level must be 1-10");
}
```

### Cooldown Manager
```javascript
const cooldownManager = require("../utils/cooldownManager");

const cooldownKey = `command:${interaction.user.id}`;

if (cooldownManager.hasCooldown(cooldownKey)) {
  const remaining = cooldownManager.getRemainingTime(cooldownKey);
  return error(`Please wait ${Math.ceil(remaining / 1000)}s`);
}

// Set cooldown for 3 seconds
cooldownManager.setCooldown(cooldownKey, 3000);
```

### Embed Builder
```javascript
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../utils/embedBuilder");

const embed = baseEmbed({
  title: "Title",
  description: "Description",
  color: colors.success
});

embed.addFields(
  { name: "Field 1", value: "Value 1", inline: true },
  { name: "Field 2", value: "Value 2", inline: true }
);
```

### Error Handler
```javascript
const { safeReply } = require("../utils/errorHandler");

// Safe way to reply to interactions
await safeReply(interaction, { content: "Response" });
```

### I18n (Internationalization)
```javascript
const { t } = require("../utils/i18n");

// Get translated string
const message = t("keyName");
const message2 = t("keyWithArgs", arg1, arg2);
```

---

## 💾 Working with Database

### Database Functions

```javascript
const db = require("../database/db");

// Get XP for user
const stmt = db.prepare("SELECT xp, level FROM xp WHERE guild_id = ? AND user_id = ?");
const user = stmt.get(guildId, userId);

// Update XP
const update = db.prepare("UPDATE xp SET xp = xp + ? WHERE guild_id = ? AND user_id = ?");
update.run(10, guildId, userId);

// Insert new
const insert = db.prepare("INSERT INTO xp VALUES (?, ?, ?, ?, ?, ?)");
insert.run(guildId, userId, 0, 0, 0, Date.now());

// Delete
const del = db.prepare("DELETE FROM warnings WHERE id = ?");
del.run(warningId);
```

### Available Tables
- **xp** - Guild XP/level data
- **warnings** - Member warnings
- **tickets** - Ticket metadata

### Database Best Practices
1. Use prepared statements (prevents SQL injection)
2. Always wrap in try-catch
3. Use transactions for multiple operations
4. Log operations for debugging
5. Use available indexes (they're created automatically)

---

## 🎯 Adding New Features

### Example: New Command

```javascript
// src/commands/fun/hello.js
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed } = require("../../utils/embedBuilder");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello to a user")
    .addUserOption((option) => 
      option.setName("user").setDescription("User to greet").setRequired(true)
    ),

  async execute(interaction) {
    try {
      const user = interaction.options.getUser("user");
      
      const embed = baseEmbed({
        title: "Hello! 👋",
        description: `Hello ${user.tag}! 🎉`
      });

      logger.log("Hello command used", { user: interaction.user.id, target: user.id });
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Hello command error", { error: error.message });
      return interaction.reply({ content: "Error executing command", ephemeral: true });
    }
  }
};
```

The command is automatically loaded! No registration needed.

### Example: New Event

```javascript
// src/events/voiceStateUpdate.js
const { Events } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    try {
      const user = newState.member.user;
      
      if (!oldState.channel && newState.channel) {
        logger.log("User joined voice", { user: user.tag, channel: newState.channel.name });
      } else if (oldState.channel && !newState.channel) {
        logger.log("User left voice", { user: user.tag, channel: oldState.channel.name });
      }
    } catch (error) {
      logger.error("Voice event error", { error: error.message });
    }
  }
};
```

The event is automatically loaded! No registration needed.

---

## 🔄 Integration Points

### Systems
Systems contain reusable business logic:
- **xpSystem** - Handle XP and leveling
- **gameSystem** - Game mechanics
- **ticketSystem** - Ticket creation/management
- **logSystem** - Sending logs
- **moderationSystem** - Moderation actions

Example using logSystem:
```javascript
const { sendLog } = require("../systems/logSystem");

await sendLog(guild, {
  title: "User Warned",
  description: `${user.tag} was warned`,
  fields: [
    { name: "Reason", value: reason, inline: false }
  ]
});
```

---

## 🧪 Testing

### Manual Testing
```bash
# Start in dev mode
npm run dev

# Test commands in Discord
/hello @User
/help
/ping

# Check logs for proper logging
# Should see timestamps and context
```

### What to Check
1. Command executes correctly
2. Logs appear with timestamps
3. Error handling works
4. Database operations succeed
5. Cooldowns work properly
6. Bot doesn't crash on errors

---

## 📊 Performance Considerations

### Database
- Queries use indexes (faster)
- WAL mode enables better concurrency
- Avoid N+1 queries
- Use prepared statements

### Memory
- Cooldown manager auto-cleans (no leaks)
- Remove unused event listeners
- Don't store large data in memory
- Use database for persistence

### Rate Limiting
- Cooldowns prevent command spam
- Built-in Discord rate limiting
- Anti-spam system available
- Consider per-guild limits for future

---

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG=true npm run dev
```

### Check Logs
- All operations are logged
- Errors include context
- Use logger.debug() for custom logs
- Search logs for specific patterns

### Inspect Database
```bash
# Install sqlite3 CLI
# sqlite3 data/database.sqlite
sqlite> SELECT * FROM xp LIMIT 5;
sqlite> SELECT COUNT(*) FROM warnings;
```

---

## 📚 Discord.js Resources

- [discord.js Documentation](https://discord.js.org)
- [Discord API Documentation](https://discord.com/developers/docs)
- [Slash Commands Guide](https://discord.js.org/docs/packages/discord.js/SlashCommandBuilder)
- [Event Handling](https://discord.js.org/docs/packages/discord.js/Events)

---

## 🎓 Best Practices

1. **Error Handling** - Always try-catch in handlers
2. **Logging** - Log important operations
3. **Validation** - Validate all inputs
4. **Permissions** - Check permissions before actions
5. **Cooldowns** - Use cooldown manager
6. **Database** - Use prepared statements
7. **Async** - Always await async operations
8. **Users** - Provide helpful error messages
9. **Comments** - Comment complex logic
10. **Testing** - Manually test all features

---

## 🚀 Deployment

### Production Checklist
- [ ] `.env` configured with real values
- [ ] All commands deployed (`npm run deploy`)
- [ ] Bot has required permissions
- [ ] Database backed up
- [ ] Logging enabled for monitoring
- [ ] All commands tested
- [ ] Error handling verified

### Production Start
```bash
npm start
```

### Monitoring
- Check logs regularly
- Monitor bot latency with `/ping`
- Watch for error patterns
- Track database usage

---

**Happy coding!** 🎉

For questions, check the logs - they're now much more informative!
=======
# 👨‍💻 Developer Guide

## Overview

This guide helps you understand the bot architecture and extend it with new features.

---

## 🏗️ Architecture

### Directory Structure
```
src/
├── commands/           # Slash commands organized by category
│   ├── admin/         # Moderation commands
│   ├── fun/           # Game commands
│   ├── tickets/       # Ticket system
│   ├── utility/       # Utility commands
│   └── xp/            # Leveling commands
├── database/          # Database initialization and schema
├── events/            # Discord.js event handlers
├── handlers/          # Command/event loading and routing
├── systems/           # Business logic systems
│   ├── gameSystem.js
│   ├── logSystem.js
│   ├── moderationSystem.js
│   ├── presenceSystem.js
│   ├── protectionSystem.js
│   ├── ticketSystem.js
│   └── xpSystem.js
├── utils/             # Shared utilities
│   ├── embedBuilder.js
│   ├── errorHandler.js
│   ├── i18n.js       # Internationalization
│   ├── logger.js     # Structured logging (NEW)
│   ├── permissions.js
│   ├── validation.js (NEW)
│   └── cooldownManager.js (NEW)
├── config.js          # Configuration management
└── index.js           # Entry point
```

---

## 📝 Creating Commands

### Basic Command Template

```javascript
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const { successEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 3, // Cooldown in seconds (optional, default 3)
  data: new SlashCommandBuilder()
    .setName("commandname")
    .setDescription("Command description")
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
    // Add options below
    .addStringOption((option) => 
      option.setName("arg").setDescription("Argument").setRequired(true)
    ),
  
  async execute(interaction) {
    try {
      const arg = interaction.options.getString("arg");

      // Your command logic here
      logger.log("Command executed", { command: "commandname", user: interaction.user.id });

      return interaction.reply({
        embeds: [successEmbed("Success", "Operation completed")]
      });
    } catch (error) {
      logger.error("Command error", { error: error.message });
      return interaction.reply({
        embeds: [errorEmbed("Error", "Something went wrong")],
        ephemeral: true
      });
    }
  }
};
```

### Command Structure
- **cooldown** (number) - Cooldown in seconds
- **data** (SlashCommandBuilder) - Command definition
- **execute** (async function) - Command handler

### Best Practices
1. Always wrap in try-catch
2. Use the logger for debugging
3. Use validation utilities for inputs
4. Return ephemeral replies for errors
5. Check permissions before executing

---

## 🔗 Creating Events

### Basic Event Template

```javascript
const { Events } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
  name: Events.MessageCreate, // Discord.js event name
  async execute(message, client) {
    try {
      if (message.author.bot) return;
      
      // Your event logic here
      logger.log("Event triggered", { event: "messageCreate", user: message.author.id });
    } catch (error) {
      logger.error("Event error", { error: error.message });
    }
  }
};
```

### Event Structure
- **name** (string) - Discord.js event name
- **once** (boolean, optional) - If true, event fires only once
- **execute** (async function) - Event handler

### Available Events
- `ready` - Bot connects and is ready
- `messageCreate` - User sends a message
- `interactionCreate` - User uses a button/select/command
- `guildMemberAdd` - Member joins server
- `guildMemberRemove` - Member leaves server
- `messageDelete` - Message is deleted
- `messageUpdate` - Message is edited

---

## 🛠️ Using Utilities

### Logger
```javascript
const logger = require("../utils/logger");

logger.log("Info message");
logger.success("Operation successful");
logger.warn("Warning message");
logger.error("Error message", { context: "additional data" });
logger.debug("Debug message"); // Only if DEBUG=true
```

### Validation
```javascript
const { 
  isValidUserId, 
  validateString, 
  validateInteger 
} = require("../utils/validation");

if (!isValidUserId(userId)) {
  return error("Invalid user ID");
}

if (!validateString(text, 1, 100)) {
  return error("Text must be 1-100 characters");
}

if (!validateInteger(level, 1, 10)) {
  return error("Level must be 1-10");
}
```

### Cooldown Manager
```javascript
const cooldownManager = require("../utils/cooldownManager");

const cooldownKey = `command:${interaction.user.id}`;

if (cooldownManager.hasCooldown(cooldownKey)) {
  const remaining = cooldownManager.getRemainingTime(cooldownKey);
  return error(`Please wait ${Math.ceil(remaining / 1000)}s`);
}

// Set cooldown for 3 seconds
cooldownManager.setCooldown(cooldownKey, 3000);
```

### Embed Builder
```javascript
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../utils/embedBuilder");

const embed = baseEmbed({
  title: "Title",
  description: "Description",
  color: colors.success
});

embed.addFields(
  { name: "Field 1", value: "Value 1", inline: true },
  { name: "Field 2", value: "Value 2", inline: true }
);
```

### Error Handler
```javascript
const { safeReply } = require("../utils/errorHandler");

// Safe way to reply to interactions
await safeReply(interaction, { content: "Response" });
```

### I18n (Internationalization)
```javascript
const { t } = require("../utils/i18n");

// Get translated string
const message = t("keyName");
const message2 = t("keyWithArgs", arg1, arg2);
```

---

## 💾 Working with Database

### Database Functions

```javascript
const db = require("../database/db");

// Get XP for user
const stmt = db.prepare("SELECT xp, level FROM xp WHERE guild_id = ? AND user_id = ?");
const user = stmt.get(guildId, userId);

// Update XP
const update = db.prepare("UPDATE xp SET xp = xp + ? WHERE guild_id = ? AND user_id = ?");
update.run(10, guildId, userId);

// Insert new
const insert = db.prepare("INSERT INTO xp VALUES (?, ?, ?, ?, ?, ?)");
insert.run(guildId, userId, 0, 0, 0, Date.now());

// Delete
const del = db.prepare("DELETE FROM warnings WHERE id = ?");
del.run(warningId);
```

### Available Tables
- **xp** - Guild XP/level data
- **warnings** - Member warnings
- **tickets** - Ticket metadata

### Database Best Practices
1. Use prepared statements (prevents SQL injection)
2. Always wrap in try-catch
3. Use transactions for multiple operations
4. Log operations for debugging
5. Use available indexes (they're created automatically)

---

## 🎯 Adding New Features

### Example: New Command

```javascript
// src/commands/fun/hello.js
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed } = require("../../utils/embedBuilder");
const logger = require("../../utils/logger");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("hello")
    .setDescription("Say hello to a user")
    .addUserOption((option) => 
      option.setName("user").setDescription("User to greet").setRequired(true)
    ),

  async execute(interaction) {
    try {
      const user = interaction.options.getUser("user");
      
      const embed = baseEmbed({
        title: "Hello! 👋",
        description: `Hello ${user.tag}! 🎉`
      });

      logger.log("Hello command used", { user: interaction.user.id, target: user.id });
      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      logger.error("Hello command error", { error: error.message });
      return interaction.reply({ content: "Error executing command", ephemeral: true });
    }
  }
};
```

The command is automatically loaded! No registration needed.

### Example: New Event

```javascript
// src/events/voiceStateUpdate.js
const { Events } = require("discord.js");
const logger = require("../utils/logger");

module.exports = {
  name: Events.VoiceStateUpdate,
  async execute(oldState, newState) {
    try {
      const user = newState.member.user;
      
      if (!oldState.channel && newState.channel) {
        logger.log("User joined voice", { user: user.tag, channel: newState.channel.name });
      } else if (oldState.channel && !newState.channel) {
        logger.log("User left voice", { user: user.tag, channel: oldState.channel.name });
      }
    } catch (error) {
      logger.error("Voice event error", { error: error.message });
    }
  }
};
```

The event is automatically loaded! No registration needed.

---

## 🔄 Integration Points

### Systems
Systems contain reusable business logic:
- **xpSystem** - Handle XP and leveling
- **gameSystem** - Game mechanics
- **ticketSystem** - Ticket creation/management
- **logSystem** - Sending logs
- **moderationSystem** - Moderation actions

Example using logSystem:
```javascript
const { sendLog } = require("../systems/logSystem");

await sendLog(guild, {
  title: "User Warned",
  description: `${user.tag} was warned`,
  fields: [
    { name: "Reason", value: reason, inline: false }
  ]
});
```

---

## 🧪 Testing

### Manual Testing
```bash
# Start in dev mode
npm run dev

# Test commands in Discord
/hello @User
/help
/ping

# Check logs for proper logging
# Should see timestamps and context
```

### What to Check
1. Command executes correctly
2. Logs appear with timestamps
3. Error handling works
4. Database operations succeed
5. Cooldowns work properly
6. Bot doesn't crash on errors

---

## 📊 Performance Considerations

### Database
- Queries use indexes (faster)
- WAL mode enables better concurrency
- Avoid N+1 queries
- Use prepared statements

### Memory
- Cooldown manager auto-cleans (no leaks)
- Remove unused event listeners
- Don't store large data in memory
- Use database for persistence

### Rate Limiting
- Cooldowns prevent command spam
- Built-in Discord rate limiting
- Anti-spam system available
- Consider per-guild limits for future

---

## 🐛 Debugging

### Enable Debug Logging
```bash
DEBUG=true npm run dev
```

### Check Logs
- All operations are logged
- Errors include context
- Use logger.debug() for custom logs
- Search logs for specific patterns

### Inspect Database
```bash
# Install sqlite3 CLI
# sqlite3 data/database.sqlite
sqlite> SELECT * FROM xp LIMIT 5;
sqlite> SELECT COUNT(*) FROM warnings;
```

---

## 📚 Discord.js Resources

- [discord.js Documentation](https://discord.js.org)
- [Discord API Documentation](https://discord.com/developers/docs)
- [Slash Commands Guide](https://discord.js.org/docs/packages/discord.js/SlashCommandBuilder)
- [Event Handling](https://discord.js.org/docs/packages/discord.js/Events)

---

## 🎓 Best Practices

1. **Error Handling** - Always try-catch in handlers
2. **Logging** - Log important operations
3. **Validation** - Validate all inputs
4. **Permissions** - Check permissions before actions
5. **Cooldowns** - Use cooldown manager
6. **Database** - Use prepared statements
7. **Async** - Always await async operations
8. **Users** - Provide helpful error messages
9. **Comments** - Comment complex logic
10. **Testing** - Manually test all features

---

## 🚀 Deployment

### Production Checklist
- [ ] `.env` configured with real values
- [ ] All commands deployed (`npm run deploy`)
- [ ] Bot has required permissions
- [ ] Database backed up
- [ ] Logging enabled for monitoring
- [ ] All commands tested
- [ ] Error handling verified

### Production Start
```bash
npm start
```

### Monitoring
- Check logs regularly
- Monitor bot latency with `/ping`
- Watch for error patterns
- Track database usage

---

**Happy coding!** 🎉

For questions, check the logs - they're now much more informative!
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
