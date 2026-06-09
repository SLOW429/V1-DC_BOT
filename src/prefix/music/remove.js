const musicSystem = require("../../systems/musicSystem");
const { error, success, checkMusicControl } = require("./_helpers");
const { t } = require("../../utils/i18n");

module.exports = {
  name: "remove",
  aliases: ["rm"],
  cooldown: 3,
  async execute(message, args) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    const position = Number(args[0]);
    if (!Number.isInteger(position) || position < 1) {
      return message.reply({
        embeds: [require("../../utils/embedBuilder").errorEmbed(t("musicRemovedTitle"), t("musicInvalidPosition"))],
        allowedMentions: { repliedUser: false }
      });
    }

    const removed = musicSystem.remove(message.guild.id, position);
    if (!removed) return error(message, "musicRemovedTitle", "musicInvalidPosition");
    return success(message, "musicRemovedTitle", "musicRemovedDescription", removed.title);
  }
};
