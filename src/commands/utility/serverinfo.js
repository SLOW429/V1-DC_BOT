const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 5,
  data: new SlashCommandBuilder()
    .setName("serverinfo")
    .setDescription("View server information."),
  async execute(interaction) {
    const guild = interaction.guild;
    const owner = await guild.fetchOwner().catch(() => null);

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("serverInfoTitle"),
          color: colors.primary
        })
          .setThumbnail(guild.iconURL({ size: 256 }))
          .addFields(
            { name: "Server", value: guild.name, inline: true },
            { name: "Owner", value: owner ? `${owner.user.tag}` : "Unknown", inline: true },
            { name: "Members", value: `${guild.memberCount}`, inline: true },
            { name: "Created", value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:R>`, inline: true },
            { name: "Roles", value: `${guild.roles.cache.size}`, inline: true },
            { name: "Channels", value: `${guild.channels.cache.size}`, inline: true }
          )
      ]
    });
  }
};
