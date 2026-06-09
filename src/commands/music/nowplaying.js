const { baseEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const musicSystem = require("../../systems/musicSystem");

module.exports = {
  prefix: true,
  cooldown: 3,
  data: { name: "nowplaying", description: "Show the currently playing song" },

  async execute(message) {
    const song = musicSystem.nowPlaying(message.guild.id);

    if (!song) {
      return message.reply({
        embeds: [errorEmbed(t("musicNowPlayingTitle"), t("musicNoQueue"))],
        allowedMentions: { repliedUser: false }
      });
    }

    return message.reply({
      embeds: [
        baseEmbed({
          title: t("musicNowPlayingTitle"),
          description: `🎶 ${song.title}`,
          color: colors.success
        })
      ],
      allowedMentions: { repliedUser: false }
    });
  }
};
