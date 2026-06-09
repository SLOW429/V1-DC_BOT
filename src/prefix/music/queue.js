const musicSystem = require("../../systems/musicSystem");
const { error, reply, musicEmbed } = require("./_helpers");
const { t } = require("../../utils/i18n");

module.exports = {
  name: "queue",
  aliases: ["q"],
  cooldown: 3,
  async execute(message) {
    const songs = musicSystem.getQueueList(message.guild.id);
    if (!songs.length) return error(message, "musicQueueTitle", "musicQueueEmpty");

    const description = songs
      .slice(0, 10)
      .map((song, index) => {
        const marker = index === 0 ? t("musicQueueNowPlaying") : `#${index + 1}`;
        return `**${marker}:** [${song.title}](${song.url})`;
      })
      .join("\n");

    return reply(message, musicEmbed({ title: t("musicQueueTitle"), description }));
  }
};
