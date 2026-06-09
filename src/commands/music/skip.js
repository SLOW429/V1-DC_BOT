const { successEmbed, errorEmbed } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");
const musicSystem = require("../../systems/musicSystem");
const { checkMusicControl } = require("../../prefix/music/_helpers");

module.exports = {
  prefix: true,
  cooldown: 3,
  data: { name: "skip", description: "Skip the current track" },

  async execute(message) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    const success = musicSystem.skip(message.guild.id);
    if (!success) {
      return message.reply({
        embeds: [errorEmbed(t("musicSkipTitle"), t("musicNoQueue"))],
        allowedMentions: { repliedUser: false }
      });
    }

    return message.reply({
      embeds: [successEmbed(t("musicSkipTitle"), t("musicSkipDescription"))],
      allowedMentions: { repliedUser: false }
    });
  }
};
