<<<<<<< HEAD
# 🚀 Setup & Migration Guide

## For New Users

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure the Bot
```bash
# Copy the example config
cp .env.example .env

# Edit the .env file with your values
# - BOT_TOKEN
# - CLIENT_ID
# - GUILD_ID
# - Channel IDs
# - Role IDs
```

### Step 3: Deploy Commands
```bash
npm run deploy
```

### Step 4: Start the Bot
```bash
# Production
npm start

# Development (with hot reload)
npm run dev
```

The bot will now:
- ✅ Validate configuration on startup
- ✅ Load all commands with error handling
- ✅ Initialize database with indexes
- ✅ Log all operations with timestamps
- ✅ Automatically clean up expired cooldowns

---

## For Existing Users (Upgrading)

### What Changed?

#### New Features
- ✅ Better `/help` command with descriptions
- ✅ Structured logging system
- ✅ Input validation utilities
- ✅ Advanced cooldown manager
- ✅ Database indexes for faster queries

#### Bug Fixes
- ✅ Fixed cooldown memory leak
- ✅ Better error handling throughout
- ✅ Improved environment validation
- ✅ Better error recovery

#### Performance
- ✅ Database indexes on key columns
- ✅ WAL mode for better concurrency
- ✅ Automatic cooldown cleanup
- ✅ Better memory management

### Migration Steps

1. **Backup your current `.env`**:
   ```bash
   cp .env .env.backup
   ```

2. **Update the code**:
   ```bash
   # Pull the latest changes or overwrite files with new versions
   ```

3. **Install any new dependencies** (there are none - no new packages):
   ```bash
   npm install
   ```

4. **Test the bot**:
   ```bash
   npm run dev
   ```

   You should see output like:
   ```
   [2024-01-15T10:30:45.123Z] [SUCCESS] Bot logged in as YourBot#0000
   [2024-01-15T10:30:45.456Z] [INFO] Loaded 30 commands
   [2024-01-15T10:30:45.789Z] [INFO] Loaded 10 events
   [2024-01-15T10:30:45.999Z] [INFO] Database initialized successfully
   ```

5. **Check the `/help` command**:
   - More detailed than before
   - Shows command descriptions
   - Better organized by category

6. **Monitor logs**:
   - New structured logging with timestamps
   - Better error messages
   - Use DEBUG=true for verbose logs

### Breaking Changes
**None!** All changes are backward compatible. Your existing commands and configurations will work exactly as before.

---

## 📋 Verification Checklist

After upgrading, verify:
- [ ] Bot starts without errors
- [ ] `/help` command works and shows all commands
- [ ] `/ping` returns latency
- [ ] Commands have proper cooldowns (no spam possible)
- [ ] Logs show startup messages
- [ ] Database operations work (try `/rank` or `/leaderboard`)
- [ ] Moderation commands still work (with proper permissions)
- [ ] Tickets system still works

---

## 🐛 Troubleshooting

### Bot won't start
1. Check `.env` file is properly configured
2. Bot token is valid
3. Check logs for error messages
4. Ensure Node.js 18.17+ is installed

### Commands not working
1. Run `npm run deploy` to deploy commands
2. Check bot permissions in Discord
3. Verify bot role is high enough in hierarchy
4. Check logs for specific error messages

### Database errors
1. Delete `data/database.sqlite` to reset (WARNING: Loses XP data)
2. Check file permissions on `data/` folder
3. Ensure 2GB+ free disk space available

### Memory leaks or performance issues
1. Enable DEBUG mode to see what's happening: `DEBUG=true`
2. Check bot status with `/ping`
3. Review logs for error patterns
4. Restart the bot if needed

---

## 🔧 Advanced Configuration

### Debug Mode
```bash
# Enable verbose logging
DEBUG=true npm start
```

### Custom Activities
Edit `.env`:
```env
BOT_ACTIVITIES=Status 1|Status 2|Status 3|Status 4|Status 5
```

### Adjust XP Settings
Edit `.env`:
```env
XP_COOLDOWN_SECONDS=30    # How often can users earn XP
XP_MIN=10                  # Minimum XP per message
XP_MAX=50                  # Maximum XP per message
```

### Enable Anti-Protections
Edit `.env`:
```env
ANTI_LINK_ENABLED=true     # Prevent link sharing
ANTI_SPAM_ENABLED=true     # Prevent message spam
```

---

## 📚 Using New Features

### Cooldown Manager
The bot now uses an advanced cooldown manager that:
- Prevents memory leaks
- Automatically cleans up expired cooldowns
- Works transparently (no code changes needed)

### Structured Logging
All logs now include:
- Timestamps (ISO 8601 format)
- Log level (INFO, SUCCESS, WARN, ERROR, DEBUG)
- Structured data
- Color coding in terminal

Example:
```
[2024-01-15T10:30:45.123Z] [SUCCESS] Bot logged in as YourBot#0000
[2024-01-15T10:30:46.456Z] [INFO] Loaded 30 commands
[2024-01-15T10:30:47.789Z] [WARN] Command not found: /invalid
```

### Validation Utilities
Available for developers adding new commands:
```javascript
const { isValidUserId, validateString } = require("../utils/validation");

// Use in your commands for better validation
if (!isValidUserId(userId)) {
  return error("Invalid user ID");
}
```

---

## 🎯 Performance Tips

1. **Monitor the logs** - Use DEBUG mode to understand bot behavior
2. **Check command cooldowns** - They should now be memory-efficient
3. **Database performance** - Queries are now faster with indexes
4. **Resource usage** - Bot should use less memory overall

---

## 📖 Documentation

- `README.md` - Main documentation
- `IMPROVEMENTS.md` - Detailed changelog
- `IMPROVEMENTS_SUMMARY.md` - Executive summary
- `.env.example` - Configuration template with comments
- This file - Setup and migration guide

---

## ✨ What's Next?

### Recommended Next Steps:
1. ✅ Deploy your bot
2. ✅ Test all commands
3. ✅ Monitor logs for any issues
4. ✅ Configure settings to your liking

### Future Enhancements:
- Command usage analytics
- Rate limiting per guild
- Configuration caching
- Web dashboard
- Automated testing

---

## 🤝 Support

If you have questions:
1. Check the logs (they're now much more informative)
2. Review the `.env.example` for configuration help
3. Check Discord permissions
4. Ensure all environment variables are set

---

**Good luck with your Discord bot!** 🎉
=======
# 🚀 Setup & Migration Guide

## For New Users

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Configure the Bot
```bash
# Copy the example config
cp .env.example .env

# Edit the .env file with your values
# - BOT_TOKEN
# - CLIENT_ID
# - GUILD_ID
# - Channel IDs
# - Role IDs
```

### Step 3: Deploy Commands
```bash
npm run deploy
```

### Step 4: Start the Bot
```bash
# Production
npm start

# Development (with hot reload)
npm run dev
```

The bot will now:
- ✅ Validate configuration on startup
- ✅ Load all commands with error handling
- ✅ Initialize database with indexes
- ✅ Log all operations with timestamps
- ✅ Automatically clean up expired cooldowns

---

## For Existing Users (Upgrading)

### What Changed?

#### New Features
- ✅ Better `/help` command with descriptions
- ✅ Structured logging system
- ✅ Input validation utilities
- ✅ Advanced cooldown manager
- ✅ Database indexes for faster queries

#### Bug Fixes
- ✅ Fixed cooldown memory leak
- ✅ Better error handling throughout
- ✅ Improved environment validation
- ✅ Better error recovery

#### Performance
- ✅ Database indexes on key columns
- ✅ WAL mode for better concurrency
- ✅ Automatic cooldown cleanup
- ✅ Better memory management

### Migration Steps

1. **Backup your current `.env`**:
   ```bash
   cp .env .env.backup
   ```

2. **Update the code**:
   ```bash
   # Pull the latest changes or overwrite files with new versions
   ```

3. **Install any new dependencies** (there are none - no new packages):
   ```bash
   npm install
   ```

4. **Test the bot**:
   ```bash
   npm run dev
   ```

   You should see output like:
   ```
   [2024-01-15T10:30:45.123Z] [SUCCESS] Bot logged in as YourBot#0000
   [2024-01-15T10:30:45.456Z] [INFO] Loaded 30 commands
   [2024-01-15T10:30:45.789Z] [INFO] Loaded 10 events
   [2024-01-15T10:30:45.999Z] [INFO] Database initialized successfully
   ```

5. **Check the `/help` command**:
   - More detailed than before
   - Shows command descriptions
   - Better organized by category

6. **Monitor logs**:
   - New structured logging with timestamps
   - Better error messages
   - Use DEBUG=true for verbose logs

### Breaking Changes
**None!** All changes are backward compatible. Your existing commands and configurations will work exactly as before.

---

## 📋 Verification Checklist

After upgrading, verify:
- [ ] Bot starts without errors
- [ ] `/help` command works and shows all commands
- [ ] `/ping` returns latency
- [ ] Commands have proper cooldowns (no spam possible)
- [ ] Logs show startup messages
- [ ] Database operations work (try `/rank` or `/leaderboard`)
- [ ] Moderation commands still work (with proper permissions)
- [ ] Tickets system still works

---

## 🐛 Troubleshooting

### Bot won't start
1. Check `.env` file is properly configured
2. Bot token is valid
3. Check logs for error messages
4. Ensure Node.js 18.17+ is installed

### Commands not working
1. Run `npm run deploy` to deploy commands
2. Check bot permissions in Discord
3. Verify bot role is high enough in hierarchy
4. Check logs for specific error messages

### Database errors
1. Delete `data/database.sqlite` to reset (WARNING: Loses XP data)
2. Check file permissions on `data/` folder
3. Ensure 2GB+ free disk space available

### Memory leaks or performance issues
1. Enable DEBUG mode to see what's happening: `DEBUG=true`
2. Check bot status with `/ping`
3. Review logs for error patterns
4. Restart the bot if needed

---

## 🔧 Advanced Configuration

### Debug Mode
```bash
# Enable verbose logging
DEBUG=true npm start
```

### Custom Activities
Edit `.env`:
```env
BOT_ACTIVITIES=Status 1|Status 2|Status 3|Status 4|Status 5
```

### Adjust XP Settings
Edit `.env`:
```env
XP_COOLDOWN_SECONDS=30    # How often can users earn XP
XP_MIN=10                  # Minimum XP per message
XP_MAX=50                  # Maximum XP per message
```

### Enable Anti-Protections
Edit `.env`:
```env
ANTI_LINK_ENABLED=true     # Prevent link sharing
ANTI_SPAM_ENABLED=true     # Prevent message spam
```

---

## 📚 Using New Features

### Cooldown Manager
The bot now uses an advanced cooldown manager that:
- Prevents memory leaks
- Automatically cleans up expired cooldowns
- Works transparently (no code changes needed)

### Structured Logging
All logs now include:
- Timestamps (ISO 8601 format)
- Log level (INFO, SUCCESS, WARN, ERROR, DEBUG)
- Structured data
- Color coding in terminal

Example:
```
[2024-01-15T10:30:45.123Z] [SUCCESS] Bot logged in as YourBot#0000
[2024-01-15T10:30:46.456Z] [INFO] Loaded 30 commands
[2024-01-15T10:30:47.789Z] [WARN] Command not found: /invalid
```

### Validation Utilities
Available for developers adding new commands:
```javascript
const { isValidUserId, validateString } = require("../utils/validation");

// Use in your commands for better validation
if (!isValidUserId(userId)) {
  return error("Invalid user ID");
}
```

---

## 🎯 Performance Tips

1. **Monitor the logs** - Use DEBUG mode to understand bot behavior
2. **Check command cooldowns** - They should now be memory-efficient
3. **Database performance** - Queries are now faster with indexes
4. **Resource usage** - Bot should use less memory overall

---

## 📖 Documentation

- `README.md` - Main documentation
- `IMPROVEMENTS.md` - Detailed changelog
- `IMPROVEMENTS_SUMMARY.md` - Executive summary
- `.env.example` - Configuration template with comments
- This file - Setup and migration guide

---

## ✨ What's Next?

### Recommended Next Steps:
1. ✅ Deploy your bot
2. ✅ Test all commands
3. ✅ Monitor logs for any issues
4. ✅ Configure settings to your liking

### Future Enhancements:
- Command usage analytics
- Rate limiting per guild
- Configuration caching
- Web dashboard
- Automated testing

---

## 🤝 Support

If you have questions:
1. Check the logs (they're now much more informative)
2. Review the `.env.example` for configuration help
3. Check Discord permissions
4. Ensure all environment variables are set

---

**Good luck with your Discord bot!** 🎉
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
