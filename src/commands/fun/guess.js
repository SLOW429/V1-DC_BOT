<<<<<<< HEAD
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { numberGuessingGame } = require("../../systems/gameSystem");

const activeGames = new Map();

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder()
    .setName("guess")
    .setDescription("Guess the secret number between 1-100 to win big!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet")
        .setMinValue(1)
        .setMaxValue(1000)
        .setRequired(false)
    ),
  async execute(interaction) {
    const bet = interaction.options.getNumber("bet") ?? 100;
    const userId = interaction.user.id;

    if (activeGames.has(userId)) {
      return interaction.reply({
        content: "❌ You already have an active guessing game! Finish it first.",
        ephemeral: true
      });
    }

    const game = numberGuessingGame();
    activeGames.set(userId, game);

    const filter = (msg) => msg.author.id === userId;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 30000,
      max: 5
    });

    let attempts = 0;
    let won = false;

    await interaction.reply({
      embeds: [
        baseEmbed({
          title: "🎯 NUMBER GUESSING GAME",
          description: `I'm thinking of a number between **${game.minRange}** and **${game.maxRange}**!\n\nYou have **5 attempts** in 30 seconds.\nGuess correctly to win **${game.winReward} coins!**`,
          color: colors.primary
        })
      ]
    });

    collector.on("collect", async (msg) => {
      attempts++;
      const guess = parseInt(msg.content);

      if (isNaN(guess)) {
        return msg.reply("❌ Please enter a valid number!");
      }

      if (guess === game.secretNumber) {
        won = true;
        collector.stop();
        await msg.reply({
          embeds: [
            baseEmbed({
              title: "🎉 CORRECT!",
              description: `You guessed **${guess}** in **${attempts}** attempts!\n\nYou won **${game.winReward} coins!**`,
              color: colors.success,
              fields: [
                { name: "Bet Amount", value: `${bet}`, inline: true },
                { name: "Winnings", value: `${game.winReward}`, inline: true },
                { name: "Total", value: `${bet + game.winReward}`, inline: true }
              ]
            })
          ]
        });
      } else if (guess < game.secretNumber) {
        await msg.reply(`📈 Too low! Attempts left: **${5 - attempts}**`);
      } else {
        await msg.reply(`📉 Too high! Attempts left: **${5 - attempts}**`);
      }
    });

    collector.on("end", async () => {
      activeGames.delete(userId);
      if (!won) {
        await interaction.followUp({
          embeds: [
            baseEmbed({
              title: "❌ GAME OVER",
              description: `You didn't guess the number in time!\n\nThe secret number was: **${game.secretNumber}**`,
              color: colors.danger
            })
          ]
        });
      }
    });
  }
};
=======
const { SlashCommandBuilder } = require("discord.js");
const { baseEmbed, colors } = require("../../utils/embedBuilder");
const { numberGuessingGame } = require("../../systems/gameSystem");

const activeGames = new Map();

module.exports = {
  cooldown: 30,
  data: new SlashCommandBuilder()
    .setName("guess")
    .setDescription("Guess the secret number between 1-100 to win big!")
    .addNumberOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount to bet")
        .setMinValue(1)
        .setMaxValue(1000)
        .setRequired(false)
    ),
  async execute(interaction) {
    const bet = interaction.options.getNumber("bet") ?? 100;
    const userId = interaction.user.id;

    if (activeGames.has(userId)) {
      return interaction.reply({
        content: "❌ You already have an active guessing game! Finish it first.",
        ephemeral: true
      });
    }

    const game = numberGuessingGame();
    activeGames.set(userId, game);

    const filter = (msg) => msg.author.id === userId;
    const collector = interaction.channel.createMessageCollector({
      filter,
      time: 30000,
      max: 5
    });

    let attempts = 0;
    let won = false;

    await interaction.reply({
      embeds: [
        baseEmbed({
          title: "🎯 NUMBER GUESSING GAME",
          description: `I'm thinking of a number between **${game.minRange}** and **${game.maxRange}**!\n\nYou have **5 attempts** in 30 seconds.\nGuess correctly to win **${game.winReward} coins!**`,
          color: colors.primary
        })
      ]
    });

    collector.on("collect", async (msg) => {
      attempts++;
      const guess = parseInt(msg.content);

      if (isNaN(guess)) {
        return msg.reply("❌ Please enter a valid number!");
      }

      if (guess === game.secretNumber) {
        won = true;
        collector.stop();
        await msg.reply({
          embeds: [
            baseEmbed({
              title: "🎉 CORRECT!",
              description: `You guessed **${guess}** in **${attempts}** attempts!\n\nYou won **${game.winReward} coins!**`,
              color: colors.success,
              fields: [
                { name: "Bet Amount", value: `${bet}`, inline: true },
                { name: "Winnings", value: `${game.winReward}`, inline: true },
                { name: "Total", value: `${bet + game.winReward}`, inline: true }
              ]
            })
          ]
        });
      } else if (guess < game.secretNumber) {
        await msg.reply(`📈 Too low! Attempts left: **${5 - attempts}**`);
      } else {
        await msg.reply(`📉 Too high! Attempts left: **${5 - attempts}**`);
      }
    });

    collector.on("end", async () => {
      activeGames.delete(userId);
      if (!won) {
        await interaction.followUp({
          embeds: [
            baseEmbed({
              title: "❌ GAME OVER",
              description: `You didn't guess the number in time!\n\nThe secret number was: **${game.secretNumber}**`,
              color: colors.danger
            })
          ]
        });
      }
    });
  }
};
>>>>>>> 315dbdfa1ad9b7243590d8a50fa18cf58460275e
