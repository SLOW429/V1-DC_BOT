const musicSystem = require("../../systems/musicSystem");
const { error, success, checkMusicControl } = require("./_helpers");

module.exports = {
  name: "shuffle",
  aliases: ["mix"],
  cooldown: 3,
  async execute(message) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    if (!musicSystem.shuffle(message.guild.id)) return error(message, "musicQueueTitle", "musicQueueEmpty");
    return success(message, "musicShuffleTitle", "musicShuffleDescription");
  }
};
