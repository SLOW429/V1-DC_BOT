const { successEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const musicSystem = require("../../systems/musicSystem");
const { checkMusicControl } = require("../../prefix/music/_helpers");

module.exports = {
  prefix: true,
  cooldown: 5,
  data: { name: "stop", description: "Stop playback, clear the queue, and leave voice" },

  async execute(message) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    const success = musicSystem.stop(message.guild.id);
    if (!success) {
      return message.reply({
        embeds: [errorEmbed(t("musicStopTitle"), t("musicNoQueue"))],
        allowedMentions: { repliedUser: false }
      });
    }

    return message.reply({
      embeds: [successEmbed(t("musicStopTitle"), t("musicStopDescription"))],
      allowedMentions: { repliedUser: false }
    });
  }
};
