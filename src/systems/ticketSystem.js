const {
  ActionRowBuilder,
  AttachmentBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  PermissionFlagsBits
} = require("discord.js");
const db = require("../database/db");
const config = require("../config");
const { baseEmbed, successEmbed, errorEmbed, colors } = require("../utils/embedBuilder");
const { sendTicketLog } = require("./logSystem");
const { t } = require("../utils/i18n");

function panelComponents() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket:create")
        .setLabel(t("openTicket"))
        .setStyle(ButtonStyle.Primary)
    )
  ];
}

function ticketControls() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId("ticket:claim").setLabel(t("claimTicket")).setStyle(ButtonStyle.Success),
      new ButtonBuilder().setCustomId("ticket:transcript").setLabel(t("saveTranscript")).setStyle(ButtonStyle.Secondary),
      new ButtonBuilder().setCustomId("ticket:close").setLabel(t("closeTicket")).setStyle(ButtonStyle.Danger)
    )
  ];
}

async function createTicketPanel(interaction) {
  const embed = baseEmbed({
    title: t("supportTickets"),
    description: t("supportTicketsDescription"),
    color: colors.primary
  });

  await interaction.reply({
    embeds: [embed],
    components: panelComponents()
  });
}

async function createTicket(interaction) {
  const existing = db.prepare(`
    SELECT * FROM tickets WHERE guild_id = ? AND owner_id = ? AND status = 'open'
  `).get(interaction.guild.id, interaction.user.id);

  if (existing) {
    return interaction.reply({
      embeds: [errorEmbed(t("ticketAlreadyOpen"), t("ticketAlreadyOpenDescription", existing.channel_id))],
      ephemeral: true
    });
  }

  const overwrites = [
    {
      id: interaction.guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel]
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.AttachFiles
      ]
    }
  ];

  if (config.roles.staff) {
    overwrites.push({
      id: config.roles.staff,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory,
        PermissionFlagsBits.ManageMessages
      ]
    });
  }

  const channel = await interaction.guild.channels.create({
    name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, ""),
    type: ChannelType.GuildText,
    parent: config.tickets.categoryId || null,
    permissionOverwrites: overwrites,
    topic: `Ticket owner: ${interaction.user.id}`
  });

  db.prepare(`
    INSERT INTO tickets (channel_id, guild_id, owner_id, status, created_at)
    VALUES (?, ?, ?, 'open', ?)
  `).run(channel.id, interaction.guild.id, interaction.user.id, Date.now());

  await channel.send({
    content: `${interaction.user} ${config.roles.staff ? `<@&${config.roles.staff}>` : ""}`,
    embeds: [
      baseEmbed({
        title: t("ticketOpened"),
        description: t("ticketOpenedDescription"),
        color: colors.success
      })
    ],
    components: ticketControls()
  });

  await sendTicketLog(interaction.guild, {
    title: t("ticketCreated"),
    description: t("ticketCreatedDescription", interaction.user, channel),
    color: colors.success
  });

  return interaction.reply({
    embeds: [successEmbed(t("ticketCreated"), t("ticketCreatedUser", channel))],
    ephemeral: true
  });
}

async function generateTranscript(channel) {
  const messages = [];
  let before;

  while (true) {
    const batch = await channel.messages.fetch({ limit: 100, before }).catch(() => null);
    if (!batch || batch.size === 0) break;
    messages.push(...batch.values());
    before = batch.last().id;
  }

  const text = messages
    .reverse()
    .map((message) => {
      const attachments = message.attachments.map((file) => file.url).join(", ");
      return `[${new Date(message.createdTimestamp).toISOString()}] ${message.author.tag}: ${message.content}${attachments ? ` Attachments: ${attachments}` : ""}`;
    })
    .join("\n");

  const buffer = Buffer.from(text || "No messages found.", "utf8");
  return new AttachmentBuilder(buffer, { name: `transcript-${channel.id}.txt` });
}

async function ensureStaff(interaction) {
  if (interaction.member.permissions.has(PermissionFlagsBits.Administrator)) return true;
  if (config.roles.staff && interaction.member.roles.cache.has(config.roles.staff)) return true;

  await interaction.reply({
    embeds: [errorEmbed(t("staffOnly"), t("staffOnlyDescription"))],
    ephemeral: true
  });
  return false;
}

async function handleTicketButton(interaction) {
  if (interaction.customId === "ticket:create") return createTicket(interaction);

  const ticket = db.prepare("SELECT * FROM tickets WHERE channel_id = ?").get(interaction.channel.id);
  if (!ticket) {
    return interaction.reply({
      embeds: [errorEmbed(t("notATicket"), t("notATicketDescription"))],
      ephemeral: true
    });
  }

  if (interaction.customId === "ticket:claim") {
    if (!(await ensureStaff(interaction))) return;

    db.prepare("UPDATE tickets SET claimed_by = ? WHERE channel_id = ?")
      .run(interaction.user.id, interaction.channel.id);

    await sendTicketLog(interaction.guild, {
      title: t("ticketClaimed"),
      description: `${interaction.user} claimed ${interaction.channel}.`,
      color: colors.primary
    });

    return interaction.reply({
      embeds: [successEmbed(t("ticketClaimed"), t("ticketClaimedDescription", interaction.user))]
    });
  }

  if (interaction.customId === "ticket:transcript") {
    if (!(await ensureStaff(interaction))) return;

    await interaction.deferReply({ ephemeral: true });
    const transcript = await generateTranscript(interaction.channel);
    await sendTicketLog(interaction.guild, {
      title: t("ticketTranscript"),
      description: t("ticketTranscriptDescription", interaction.channel),
      files: [transcript],
      color: colors.primary
    });

    return interaction.editReply({
      embeds: [successEmbed(t("transcriptSaved"), t("transcriptSavedDescription"))]
    });
  }

  if (interaction.customId === "ticket:close") {
    if (!(await ensureStaff(interaction))) return;

    await interaction.deferReply();
    const transcript = await generateTranscript(interaction.channel);

    db.prepare("UPDATE tickets SET status = 'closed', closed_at = ? WHERE channel_id = ?")
      .run(Date.now(), interaction.channel.id);

    await sendTicketLog(interaction.guild, {
      title: t("ticketClosed"),
      description: `${interaction.user} closed #${interaction.channel.name}.`,
      files: [transcript],
      color: colors.danger
    });

    await interaction.editReply({
      embeds: [successEmbed(t("ticketClosing"), t("ticketClosingDescription"))]
    });

    setTimeout(() => interaction.channel.delete("Ticket closed").catch(() => null), 5000);
  }
}

module.exports = {
  createTicketPanel,
  handleTicketButton
};
