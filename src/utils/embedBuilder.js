const { EmbedBuilder } = require("discord.js");
<<<<<<< HEAD
const config = require("../config");
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
const { t } = require("./i18n");

const colors = {
  primary: 0x5865f2,
  success: 0x2ecc71,
  warning: 0xf1c40f,
  danger: 0xe74c3c,
  neutral: 0x2b2d31
};

<<<<<<< HEAD
function resolveText(value) {
  if (value === undefined || value === null) return null;
  if (typeof value === "string") return value;
  if (typeof value === "function") return value();
  if (typeof value === "object" && value.en && value.ar) {
    return value[config.language] || value.en;
  }
  return String(value);
}

function buildEmbed({ title, description, fields = [], color = colors.primary } = {}) {
  const embed = new EmbedBuilder().setColor(color).setTimestamp();

  const resolvedTitle = resolveText(title);
  const resolvedDescription = resolveText(description);

  if (resolvedTitle) embed.setTitle(resolvedTitle);
  if (resolvedDescription) embed.setDescription(resolvedDescription);

  if (Array.isArray(fields) && fields.length) {
    embed.addFields(
      fields.map((field) => ({
        name: resolveText(field.name),
        value: resolveText(field.value),
        inline: field.inline || false
      }))
    );
  }

  embed.setFooter({ text: t("footer") });
  return embed;
}

function baseEmbed(options = {}) {
  return buildEmbed(options);
}

function successEmbed(title, description) {
  return buildEmbed({ title, description, color: colors.success });
}

function errorEmbed(title, description) {
  return buildEmbed({ title, description, color: colors.danger });
}

function warningEmbed(title, description) {
  return buildEmbed({ title, description, color: colors.warning });
}

function infoEmbed(title, description) {
  return buildEmbed({ title, description, color: colors.primary });
}

function logEmbed(title, description) {
  return buildEmbed({ title, description, color: colors.neutral });
=======
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
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
}

module.exports = {
  colors,
  baseEmbed,
  successEmbed,
  errorEmbed,
<<<<<<< HEAD
  warningEmbed,
  infoEmbed,
=======
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
  logEmbed
};
