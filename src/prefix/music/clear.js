const musicSystem = require("../../systems/musicSystem");
const { success, checkMusicControl } = require("./_helpers");

module.exports = {
  name: "clear",
  aliases: ["clearqueue"],
  cooldown: 3,
  async execute(message) {
    const controlError = checkMusicControl(message);
    if (controlError) return controlError;

    musicSystem.clear(message.guild.id);
    return success(message, "musicClearTitle", "musicClearDescription");
  }
};
