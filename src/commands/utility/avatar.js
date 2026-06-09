const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { t } = require("../../utils/i18n");

module.exports = {
  cooldown: 3,
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("View a user's avatar.")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to inspect").setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const avatar = user.displayAvatarURL({ size: 1024 });

    return interaction.reply({
      embeds: [
        baseEmbed({
          title: t("avatarTitle", user),
          description: `[Open avatar](${avatar})`,
          color: colors.primary
        }).setImage(avatar)
      ]
    });
  }
};
