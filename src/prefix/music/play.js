const musicSystem = require("../../systems/musicSystem");
const { t } = require("../../utils/i18n");
const { error, success, resolveVoiceChannel, checkMusicControl } = require("./_helpers");

module.exports = {
  name: "play",
  aliases: ["p"],
  cooldown: 5,
  async execute(message, args) {
    const query = args.join(" ").trim();
    if (!query) return error(message, "musicNoQueryTitle", "musicNoQueryDescription");

    const voiceChannel = await resolveVoiceChannel(message);
    if (!voiceChannel) return error(message, "musicVoiceChannelRequired", "musicUserChannelRequired");

    const controlError = checkMusicControl(message, { requireBotInVoice: false, voiceChannel });
    if (controlError) return controlError;

    const song = await musicSystem.searchSong(query);
    if (!song) return error(message, "musicNotFoundTitle", "musicNotFoundDescription");

    try {
      await musicSystem.play(message.guild, voiceChannel, message.channel, {
        title: song.title,
        url: song.url,
        requestedBy: message.author.tag
      });
      return success(message, "musicAddedTitle", "musicAddedDescription", song.title);
    } catch (playError) {
      return message.reply({
        embeds: [require("../../utils/embedBuilder").errorEmbed(t("musicErrorTitle"), t("musicErrorDescription"))],
        allowedMentions: { repliedUser: false }
      });
    }
  }
};
