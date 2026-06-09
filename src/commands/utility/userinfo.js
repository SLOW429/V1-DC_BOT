const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("View user information.")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to inspect").setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id).catch(() => null);

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("userInfoTitle"),
          color: colors.primary
        })
          .setThumbnail(user.displayAvatarURL({ size: 256 }))
          .addFields(
            { name: "User", value: user.tag, inline: true },
            { name: "ID", value: user.id, inline: true },
            { name: "Bot", value: user.bot ? "Yes" : "No", inline: true },
            { name: "Account Created", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: "Joined Server", value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "Unknown", inline: true },
            { name: "Highest Role", value: member?.roles.highest ? `${member.roles.highest}` : "Unknown", inline: true }
          )
      ],
      ephemeral: true
    });
  }
};
