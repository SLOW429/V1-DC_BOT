const { ChannelType } = require("discord.js");
const config = require("../../config");
const musicSystem = require("../../systems/musicSystem");
const { errorEmbed, successEmbed, baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

const MUSIC_CONTROL_ERROR_KEYS = {
  not_in_voice: ["musicControlNotInVoiceTitle", "musicControlNotInVoiceDescription"],
  bot_not_in_voice: ["musicControlBotNotInVoiceTitle", "musicControlBotNotInVoiceDescription"],
  different_channel: ["musicControlDifferentChannelTitle", "musicControlDifferentChannelDescription"],
  no_connect: ["musicControlNoPermissionTitle", "musicControlNoPermissionDescription"],
  no_speak: ["musicControlNoPermissionTitle", "musicControlNoPermissionDescription"]
};

function reply(message, embed) {
  return message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
}

function success(message, titleKey, descriptionKey, ...args) {
  return reply(message, successEmbed(t(titleKey), t(descriptionKey, ...args)));
}

function error(message, titleKey, descriptionKey, ...args) {
  return reply(message, errorEmbed(t(titleKey), t(descriptionKey, ...args)));
}

function musicEmbed(options) {
  return baseEmbed({ color: colors.primary, ...options });
}

async function resolveVoiceChannel(message) {
  if (config.music.voiceChannelId) {
    const cached = message.guild.channels.cache.get(config.music.voiceChannelId);
    if (cached?.type === ChannelType.GuildVoice) return cached;

    const fetched = await message.guild.channels.fetch(config.music.voiceChannelId).catch(() => null);
    if (fetched?.type === ChannelType.GuildVoice) return fetched;
  }

  return message.member?.voice?.channel || null;
}

function musicControlError(message, code) {
  const keys = MUSIC_CONTROL_ERROR_KEYS[code] || ["musicErrorTitle", "musicErrorDescription"];
  return error(message, keys[0], keys[1]);
}

function checkMusicControl(message, options = {}) {
  const result = musicSystem.validateMusicControl(
    message.guild,
    message.member,
    message.guild.members.me,
    options
  );
  if (result.ok) return null;
  return musicControlError(message, result.code);
}

module.exports = {
  reply,
  success,
  error,
  musicEmbed,
  resolveVoiceChannel,
  checkMusicControl,
  musicControlError
};
