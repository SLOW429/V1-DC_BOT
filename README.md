# Premium Discord Bot

A clean, scalable Discord bot built with **Node.js** and **discord.js v14**. It includes welcome messages, auto roles, XP/levels, moderation, tickets, logging, cooldowns, anti-crash protection, and a SQLite database.

## Features

- Professional bilingual Arabic/English welcome embeds
- Configurable auto role with permission and hierarchy checks
- XP and level system with anti-spam cooldowns
- `/rank` and `/leaderboard`
- Moderation commands: `/ban`, `/kick`, `/timeout`, `/clear`, `/warn`, `/warnings`
- Ticket panel, private ticket channels, claim, close, and transcript buttons
- **⭐ ENHANCED Game commands** with multiplier rewards:
  - `/coinflip` - Coin flip with up to 5x multiplier (10% lucky chance)
  - `/dice` - Advanced dice rolling with bonuses
  - `/rps` - Rock Paper Scissors with 2x win multiplier
  - `/slots` - Slot machine with up to 10x multiplier
  - `/spin` - Lucky Spin wheel with huge rewards
  - `/guess` - Number guessing game (1-100) with big payouts
  - `/8ball` - Magic 8 ball answers
  - `/trivia` - Trivia questions in Arabic and English
- Utility commands: `/ping`, `/serverinfo`, `/userinfo`, `/avatar`, `/help`
- Moderation, member, message, and ticket logs
- SQLite persistence with database indexes
- Dynamic bot presence rotation
- Command, event, button, and select menu handlers
- Optional anti-link and anti-spam protections
- **Advanced cooldown management** with automatic cleanup
- **Structured logging** system for debugging
- **Input validation utilities** for data integrity
- **Graceful error handling** with detailed logging
- **Database optimization** with WAL mode and indexes
- **⭐ Owner Special Features:**
  - Strikethrough word reaction (~~word~~ triggers GIF)
  - Smart message forwarding with `/send message content`

## Recent Improvements (v1.1.0+)

### 🎮 Game System 10x Better
- Added multiplier rewards to all games
- New advanced games: Lucky Spin, Number Guessing
- Enhanced visuals with emojis and detailed results
- Better payout system with bonus mechanics
- Lucky chance multipliers (up to 5x on coin flip, 10x on slots)

### 👑 Owner Features
- Strikethrough word detection sends GIF and deletes message
- Smart message command: Type "ابعت الرساله دي" + message content
- Bot will send your message and delete the command

### Performance
- Fixed cooldown memory leak with new `CooldownManager`
- Added database indexes for faster queries
- Enabled SQLite WAL mode and optimized pragmas
- Removed memory-inefficient cooldown collection from client

### Code Quality
- Added comprehensive validation utilities (`validation.js`)
- Implemented structured logging system (`logger.js`)
- Improved error handling with detailed context
- Better environment variable validation with graceful exit
- Added error handling to event and button handlers

### Reliability
- Enhanced anti-crash protection with graceful shutdown
- Better error recovery in interaction handlers
- Improved validation in all handlers
- Added safety checks for interaction state

### Developer Experience
- Added logging throughout the bot for better debugging
- Environment validation that fails fast with helpful messages
- Better error messages for troubleshooting

## Installation

1. Install Node.js 18.17 or newer.
2. Open a terminal in this project folder.
3. Install dependencies:

```bash
npm install
```

4. Copy `.env.example` to `.env`.
5. Fill in your bot token, client ID, guild ID, channel IDs, category ID, and role IDs.
6. **⭐ Add your Discord User ID to `OWNER_ID` in `.env` to enable owner features**
7. Deploy slash commands:

```bash
npm run deploy
```

8. Start the bot:

```bash
npm start
```

## Getting Discord IDs

1. Open Discord.
2. Go to **User Settings > Advanced**.
3. Enable **Developer Mode**.
4. Right-click your server, channel, role, or user.
5. Click **Copy ID**.

## Required Bot Permissions

Invite the bot with these permissions:

- View Channels
- Send Messages
- Embed Links
- Attach Files
- Read Message History
- Manage Messages
- Manage Roles
- Kick Members
- Ban Members
- Moderate Members
- Manage Channels

The bot role must be above roles it needs to assign and above members it needs to moderate.

## Configuration

All environment values live in `.env`.

```env
BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_application_client_id_here
GUILD_ID=your_server_id_here
OWNER_ID=your_user_id_here

WELCOME_CHANNEL_ID=welcome_channel_id
LOG_CHANNEL_ID=log_channel_id
TICKET_LOG_CHANNEL_ID=ticket_log_channel_id
TICKET_CATEGORY_ID=ticket_category_id
STAFF_ROLE_ID=staff_role_id
AUTO_ROLE_ID=member_role_id
BOT_LANGUAGE=ar
BOT_ACTIVITY=SLOW COMMUNITY
BOT_ACTIVITIES=SLOW COMMUNITY|Support Bot|Managing Tickets|Moderating the Server|Leveling Members|Protecting the Community|Running Fun Games
```

Optional settings:

```env
XP_COOLDOWN_SECONDS=60
XP_MIN=15
XP_MAX=25
ANTI_LINK_ENABLED=false
ANTI_SPAM_ENABLED=true
LEAVE_MESSAGES_ENABLED=true
```

## Project Structure

```text
src/
  index.js
  config.js
  commands/
    admin/
    fun/
    tickets/
    utility/
    xp/
  database/
    db.js
  events/
  handlers/
  systems/
    ownerFeaturesSystem.js (NEW)
    gameSystem.js (ENHANCED)
  utils/
data/
  database.sqlite
deploy-commands.js
package.json
.env.example
README.md
```

## Owner Features Guide

### Strikethrough Reaction
When you (the owner) type a message with strikethrough text (`~~word~~`), the bot will:
1. Send the configured GIF
2. Delete your message with strikethrough

Example:
```
~~bad word~~
```
→ Bot sends GIF and deletes your message

### Smart Message Command
Use the command `ابعت الرساله دي` (send this message) to have the bot send a message for you:

```
ابعت الرساله دي Hello everyone! This is an important announcement.
```
→ Bot sends "Hello everyone! This is an important announcement." and deletes the command message

## Game Commands Guide

### Enhanced Games with Multipliers

**Coin Flip** - `/coinflip choice:[heads/tails] bet:[optional]`
- 2x normal multiplier
- 10% chance for 5x lucky multiplier

**Dice** - `/dice sides:[2-100] count:[1-10]`
- Roll multiple dice
- Bonus coins if you roll high (70%+ of max)

**Rock Paper Scissors** - `/rps choice:[rock/paper/scissors] bet:[optional]`
- 2x multiplier on win
- 1x on draw
- 0.5x on loss

**Slots** - `/slots bet:[optional]`
- Three symbols match = 10x multiplier
- Two symbols match = 3x multiplier
- Better emoji visuals

**Lucky Spin** - `/spin bet:[optional]`
- 5 different outcomes
- Up to 5x multiplier (Grand Prize)
- Exciting visual feedback

**Number Guessing** - `/guess bet:[optional]`
- Guess a number 1-100
- 5 attempts in 30 seconds
- Win big money if correct!

## Notes

- Slash commands are deployed per guild for fast development updates.
- Transcripts are generated as `.txt` files and sent to the configured ticket log channel.
- Never commit your real `.env` file or bot token.
- Owner features are only available to the user ID specified in `OWNER_ID`
- Games reward coins based on multipliers - integrate with your economy system
