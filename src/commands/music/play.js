const { ChannelType } = require("discord.js");
const { errorEmbed, successEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const config = require("../../config");
const musicSystem = require("../../systems/musicSystem");
const { checkMusicControl } = require("../../prefix/music/_helpers");

module.exports = {
  prefix: true,
  cooldown: 5,
  data: { name: "play", description: "Play music from YouTube or search terms" },

  async execute(message, args) {
    const query = args.join(" ").trim();
    if (!query) {
      return message.reply({
        embeds: [errorEmbed(t("musicNoQueryTitle"), t("musicNoQueryDescription"))],
        allowedMentions: { repliedUser: false }
      });
    }

    let voiceChannel = null;
    if (config.music.voiceChannelId) {
      const candidate = message.guild.channels.cache.get(config.music.voiceChannelId);
      if (candidate && candidate.type === ChannelType.GuildVoice) {
        voiceChannel = candidate;
      }
    }

    if (!voiceChannel) {
      voiceChannel = message.member.voice.channel;
    }

    if (!voiceChannel) {
      return message.reply({
        embeds: [errorEmbed(t("musicVoiceChannelRequired"), t("musicUserChannelRequired"))],
        allowedMentions: { repliedUser: false }
      });
    }

    const controlError = checkMusicControl(message, { requireBotInVoice: false, voiceChannel });
    if (controlError) return controlError;

    try {
      const songInfo = await musicSystem.searchSong(query);
      if (!songInfo) {
        return message.reply({
          embeds: [errorEmbed(t("musicNotFoundTitle"), t("musicNotFoundDescription"))],
          allowedMentions: { repliedUser: false }
        });
      }

      await musicSystem.play(message.guild, voiceChannel, message.channel, {
        title: songInfo.title,
        url: songInfo.url,
        requestedBy: message.author.tag
      });

      return message.reply({
        embeds: [
          successEmbed(t("musicAddedTitle"), t("musicAddedDescription", songInfo.title)).setColor(colors.success)
        ],
        allowedMentions: { repliedUser: false }
      });
    } catch (error) {
      return message.reply({
        embeds: [errorEmbed(t("musicErrorTitle"), t("musicErrorDescription"))],
        allowedMentions: { repliedUser: false }
      });
    }
  }
};
