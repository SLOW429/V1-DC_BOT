const musicSystem = require("../../systems/musicSystem");
const { error, success, checkMusicControl } = require("./_helpers");

module.exports = {
  name: "stop",
  aliases: ["leave", "disconnect"],
  cooldown: 3,
  async execute(message) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    if (!musicSystem.stop(message.guild.id)) return error(message, "musicStopTitle", "musicNoQueue");
    return success(message, "musicStopTitle", "musicStopDescription");
  }
};
