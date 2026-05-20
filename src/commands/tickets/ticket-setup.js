const { PermissionFlagsBits, SlashCommandBuilder } = require("discord.js");
const { createTicketPanel } = require("../../systems/ticketSystem");

module.exports = {
  cooldown: 10,
  data: new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Create the support ticket panel.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  async execute(interaction) {
    await createTicketPanel(interaction);
  }
};
