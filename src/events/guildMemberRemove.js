const { Events } = require("discord.js");
const config = require("../config");
const { baseEmbed, colors } = require("../utils/embedBuilder");
const { sendLog } = require("../systems/logSystem");
const { t } = require("../utils/i18n");

module.exports = {
  name: Events.GuildMemberRemove,
  async execute(member) {
    try {
      if (config.features.leaveMessages && config.channels.welcome) {
        const channel = await member.guild.channels.fetch(config.channels.welcome).catch(() => null);
        if (channel?.isTextBased()) {
          await channel.send({
            embeds: [
              baseEmbed({
                title: t("memberLeft"),
                description: t("memberLeftDescription", member),
                color: colors.danger
              }).setThumbnail(member.user.displayAvatarURL({ size: 256 }))
            ]
          });
        }
      }

      await sendLog(member.guild, {
        title: t("memberLeft"),
        description: t("memberLeftDescription", member),
        color: colors.danger,
        fields: [{ name: t("userId"), value: member.id, inline: true }]
      });
    } catch (error) {
      console.error("guildMemberRemove error:", error);
    }
  }
};
