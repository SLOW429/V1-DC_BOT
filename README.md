# Premium Discord Bot

A clean, scalable Discord bot built with **Node.js** and **discord.js v14**. It includes welcome messages, auto roles, XP/levels, moderation, tickets, logging, cooldowns, anti-crash protection, and a SQLite database.

## Features

- Professional bilingual Arabic/English welcome embeds
- Configurable auto role with permission and hierarchy checks
- XP and level system with anti-spam cooldowns
- `/rank` and `/leaderboard`
- Moderation commands: `/ban`, `/kick`, `/timeout`, `/clear`, `/warn`, `/warnings`
- Ticket panel, private ticket channels, claim, close, and transcript buttons
- Game commands: `/coinflip`, `/dice`, `/8ball`, `/rps`, `/slots`, `/trivia`
- Utility commands: `/ping`, `/serverinfo`, `/userinfo`, `/avatar`, `/help`
- Moderation, member, message, and ticket logs
- SQLite persistence
- Dynamic bot presence rotation
- Command, event, button, and select menu handlers
- Optional anti-link and anti-spam protections

## Installation

1. Install Node.js 18.17 or newer.
2. Open a terminal in this project folder.
3. Install dependencies:

```bash
npm install
```

4. Copy `.env.example` to `.env`.
5. Fill in your bot token, client ID, guild ID, channel IDs, category ID, and role IDs.
6. Deploy slash commands:

```bash
npm run deploy
```

7. Start the bot:

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
  utils/
data/
  database.sqlite
deploy-commands.js
package.json
.env.example
README.md
```

## Notes

- Slash commands are deployed per guild for fast development updates.
- Transcripts are generated as `.txt` files and sent to the configured ticket log channel.
- Never commit your real `.env` file or bot token.
