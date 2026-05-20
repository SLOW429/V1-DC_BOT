const { EmbedBuilder } = require("discord.js");
const { t } = require("./i18n");

const colors = {
  primary: 0x5865f2,
  success: 0x2ecc71,
  warning: 0xf1c40f,
  danger: 0xe74c3c,
  neutral: 0x2b2d31
};

function baseEmbed({ title, description, color = colors.primary } = {}) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title || null)
    .setDescription(description || null)
    .setTimestamp()
    .setFooter({ text: t("footer") });
}

function successEmbed(title, description) {
  return baseEmbed({ title, description, color: colors.success });
}

function errorEmbed(title, description) {
  return baseEmbed({ title, description, color: colors.danger });
}

function logEmbed(title, description) {
  return baseEmbed({ title, description, color: colors.neutral });
}

module.exports = {
  colors,
  baseEmbed,
  successEmbed,
  errorEmbed,
  logEmbed
};
