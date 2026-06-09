const { Events, PermissionsBitField } = require("discord.js");
const config = require("../config");
const { baseEmbed, colors } = require("../utils/embedBuilder");
const { canManageRole } = require("../utils/permissions");
const { sendLog } = require("../systems/logSystem");
const { t } = require("../utils/i18n");

module.exports = {
  name: Events.GuildMemberAdd,
  async execute(member) {
    try {
      const welcomeChannel = config.channels.welcome
        ? await member.guild.channels.fetch(config.channels.welcome).catch(() => null)
        : null;

      if (welcomeChannel?.isTextBased()) {
        const embed = baseEmbed({
          title: t("welcomeTitle"),
          description: t("welcomeDescription", member),
          color: colors.success
        })
          .setThumbnail(member.user.displayAvatarURL({ size: 256 }))
          .addFields(
            { name: t("member"), value: member.user.tag, inline: true },
            { name: t("memberCount"), value: `${member.guild.memberCount}`, inline: true },
            { name: t("accountCreated"), value: `<t:${Math.floor(member.user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: "Message", value: `${t("enjoyServer")}\n${t("enjoyServerAr")}`, inline: false }
          );

        await welcomeChannel.send({ embeds: [embed] });
      }

      if (config.roles.auto) {
        const role = await member.guild.roles.fetch(config.roles.auto).catch(() => null);
        const me = member.guild.members.me;

        if (role && me.permissions.has(PermissionsBitField.Flags.ManageRoles) && canManageRole(member.guild, role)) {
          await member.roles.add(role, "Configured auto role").catch(() => null);
        }
      }

      await sendLog(member.guild, {
        title: t("memberJoined"),
        description: t("memberJoinedDescription", member),
        color: colors.success,
        fields: [
          { name: t("userId"), value: member.id, inline: true },
          { name: t("memberCount"), value: `${member.guild.memberCount}`, inline: true }
        ]
      });
    } catch (error) {
      console.error("guildMemberAdd error:", error);
    }
  }
};
