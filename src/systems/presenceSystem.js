const { ActivityType } = require("discord.js");
const config = require("../config");

function startPresenceRotation(client) {
  const activityNames = config.activities.length
    ? config.activities
    : [
        config.activity,
        "Support Bot",
        "Managing Tickets",
        "Moderating the Server",
        "Leveling Members",
        "Protecting the Community",
        "Running Fun Games"
      ];

  const activities = activityNames.map((name) => ({
    name,
    type: ActivityType.Playing
  }));

  let index = 0;

  const rotate = () => {
    const activity = activities[index % activities.length];
    client.user.setPresence({
      activities: [activity],
      status: "online"
    });
    index += 1;
  };

  rotate();
  setInterval(rotate, 60_000);
}

module.exports = { startPresenceRotation };
