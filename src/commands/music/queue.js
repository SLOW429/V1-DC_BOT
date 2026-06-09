const { baseEmbed, errorEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const musicSystem = require("../../systems/musicSystem");

module.exports = {
  prefix: true,
  cooldown: 3,
  data: { name: "queue", description: "Show the current music queue" },

  async execute(message) {
    const songs = musicSystem.getQueueList(message.guild.id);
    if (!songs.length) {
      return message.reply({
        embeds: [errorEmbed(t("musicQueueTitle"), t("musicQueueEmpty"))],
        allowedMentions: { repliedUser: false }
      });
    }

    const description = songs
      .slice(0, 10)
      .map((song, index) => `**${index + 1}.** ${song.title}`)
      .join("\n");

    return message.reply({
      embeds: [
        baseEmbed({
          title: t("musicQueueTitle"),
          description,
          color: colors.primary,
          fields: [
            { name: t("musicQueueNowPlaying"), value: songs[0].title, inline: false }
          ]
        })
      ],
      allowedMentions: { repliedUser: false }
    });
  }
};
