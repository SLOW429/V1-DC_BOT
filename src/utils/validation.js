<<<<<<< HEAD
/**
 * Utility functions for input validation across the bot
 */

function isValidUserId(userId) {
  if (typeof userId !== "string") return false;
  return /^\d{17,19}$/.test(userId.trim());
}

function isValidChannelId(channelId) {
  if (typeof channelId !== "string") return false;
  return /^\d{17,19}$/.test(channelId.trim());
}

function isValidRoleId(roleId) {
  if (typeof roleId !== "string") return false;
  return /^\d{17,19}$/.test(roleId.trim());
}

function isValidGuildId(guildId) {
  if (typeof guildId !== "string") return false;
  return /^\d{17,19}$/.test(guildId.trim());
}

function validateString(value, minLength = 1, maxLength = 2000) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

function validateUrl(url) {
  try {
    if (typeof url !== "string") return false;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateInteger(value, min = null, max = null) {
  if (!Number.isInteger(value)) return false;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
}

function sanitizeString(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().substring(0, maxLength);
}

function sanitizeUserId(userId) {
  if (!isValidUserId(userId)) return null;
  return userId.trim();
}

module.exports = {
  isValidUserId,
  isValidChannelId,
  isValidRoleId,
  isValidGuildId,
  validateString,
  validateUrl,
  validateInteger,
  sanitizeString,
  sanitizeUserId
};
=======
/**
 * Utility functions for input validation across the bot
 */

function isValidUserId(userId) {
  if (typeof userId !== "string") return false;
  return /^\d{17,19}$/.test(userId.trim());
}

function isValidChannelId(channelId) {
  if (typeof channelId !== "string") return false;
  return /^\d{17,19}$/.test(channelId.trim());
}

function isValidRoleId(roleId) {
  if (typeof roleId !== "string") return false;
  return /^\d{17,19}$/.test(roleId.trim());
}

function isValidGuildId(guildId) {
  if (typeof guildId !== "string") return false;
  return /^\d{17,19}$/.test(guildId.trim());
}

function validateString(value, minLength = 1, maxLength = 2000) {
  if (typeof value !== "string") return false;
  const trimmed = value.trim();
  return trimmed.length >= minLength && trimmed.length <= maxLength;
}

function validateUrl(url) {
  try {
    if (typeof url !== "string") return false;
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

function validateInteger(value, min = null, max = null) {
  if (!Number.isInteger(value)) return false;
  if (min !== null && value < min) return false;
  if (max !== null && value > max) return false;
  return true;
}

function sanitizeString(value, maxLength = 2000) {
  if (typeof value !== "string") return "";
  return value.trim().substring(0, maxLength);
}

function sanitizeUserId(userId) {
  if (!isValidUserId(userId)) return null;
  return userId.trim();
}

module.exports = {
  isValidUserId,
  isValidChannelId,
  isValidRoleId,
  isValidGuildId,
  validateString,
  validateUrl,
  validateInteger,
  sanitizeString,
  sanitizeUserId
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
