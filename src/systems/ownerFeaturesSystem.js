<<<<<<< HEAD
const config = require("../config");
const logger = require("../utils/logger");

const STRIKETHROUGH_REGEX = /~~[\s\S]+?~~/;

async function safeDelete(message) {
  try {
    if (message.deletable) {
      await message.delete();
    }
  } catch (error) {
    logger.warn("Failed to delete owner feature message", { error: error.message, messageId: message.id });
  }
}

async function handleOwnerFeatures(message) {
  if (!message.author || message.author.bot) return false;
  if (!config.owner.id || message.author.id !== config.owner.id) return false;

  try {
    if (message.content.startsWith(config.owner.arabicSendCommand)) {
      const content = message.content.slice(config.owner.arabicSendCommand.length).trim();
      if (content) {
        await message.channel.send({ content, allowedMentions: { parse: [] } });
      }
      await safeDelete(message);
      return true;
    }

    if (STRIKETHROUGH_REGEX.test(message.content)) {
      await safeDelete(message);
      if (config.owner.strikethroughGif) {
        await message.channel.send(config.owner.strikethroughGif);
      }
      return true;
    }
  } catch (error) {
    logger.error("Owner feature failed", { error: error.message, stack: error.stack });
  }

  return false;
}

module.exports = { handleOwnerFeatures };
=======
const config = require("../config");

const OWNER_ID = process.env.OWNER_ID || ""; // Add to .env
const STRIKETHROUGH_REGEX = /~~(.+?)~~/g;
const SEND_COMMAND = "ابعت الرساله دي";

async function handleOwnerFeatures(message) {
  if (!message.author || message.author.bot) return;
  if (!OWNER_ID || message.author.id !== OWNER_ID) return;

  try {
    // Feature 1: Strikethrough word reaction
    if (STRIKETHROUGH_REGEX.test(message.content)) {
      const gifUrl =
        "https://media.giphy.com/media/3o7TKU8J0jZw0bPt0c/giphy.gif"; // Replace with your GIF URL
      await message.channel.send(gifUrl);
      await message.delete();
      return;
    }

    // Feature 2: Send message command
    if (message.content.startsWith(SEND_COMMAND)) {
      const messageContent = message.content
        .substring(SEND_COMMAND.length)
        .trim();
      if (messageContent) {
        await message.channel.send(messageContent);
        await message.delete();
      }
      return;
    }
  } catch (error) {
    console.error("Error in owner features:", error);
  }
}

module.exports = { handleOwnerFeatures };
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
