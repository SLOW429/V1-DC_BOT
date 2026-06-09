const { PermissionsBitField } = require("discord.js");

function hasPermission(member, permission) {
  return member.permissions.has(permission);
}

function canModerate(executor, target) {
  if (!target || target.id === target.guild.ownerId) return false;
  if (executor.id === executor.guild.ownerId) return true;
  return executor.roles.highest.comparePositionTo(target.roles.highest) > 0;
}

function botCanModerate(guild, target) {
  const me = guild.members.me;
  if (!me || !target || target.id === guild.ownerId) return false;
  return me.roles.highest.comparePositionTo(target.roles.highest) > 0;
}

function canManageRole(guild, role) {
  const me = guild.members.me;
  if (!me || !role) return false;
  return me.permissions.has(PermissionsBitField.Flags.ManageRoles)
    && me.roles.highest.comparePositionTo(role) > 0;
}

module.exports = {
  hasPermission,
  canModerate,
  botCanModerate,
  canManageRole
};
