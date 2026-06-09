const musicSystem = require("../../systems/musicSystem");
const { error, reply, musicEmbed } = require("./_helpers");
const { t } = require("../../utils/i18n");

module.exports = {
  name: "nowplaying",
  aliases: ["np"],
  cooldown: 3,
  async execute(message) {
    const song = musicSystem.nowPlaying(message.guild.id);
    if (!song) return error(message, "musicQueueTitle", "musicNoQueue");
    return reply(
      message,
      musicEmbed({
        title: t("musicQueueNowPlaying"),
        description: `[${song.title}](${song.url})`
      })
    );
  }
};
