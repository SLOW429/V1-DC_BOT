const musicSystem = require("../../systems/musicSystem");
const { error, success, checkMusicControl } = require("./_helpers");

module.exports = {
  name: "resume",
  aliases: ["unpause"],
  cooldown: 3,
  async execute(message) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    if (!musicSystem.resume(message.guild.id)) return error(message, "musicQueueTitle", "musicNoQueue");
    return success(message, "musicResumedTitle", "musicResumedDescription");
  }
};
