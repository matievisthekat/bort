module.exports = class ErrorManager {
  constructor(client) {
    this.client = client;
    this.prefix = this.client.config.msgPrefixes.error;
  }

  async custom(message, channel, msg) {
    return channel.send(await message.translate(`${this.prefix} ${msg}`));
  }

  async unknownErr(message, msg, err) {
    try {
      const bugs = this.client.channels.cache.get(
        this.client.bugReportsChannelID
      );
      const embed = new this.client.embed()
        .setAuthor("An unknown error occured!")
        .setColor(this.client.colours.red)
        .addField("Error", err.message)
        .addField(
          "In server",
          `**${msg.guild.name}**  \`${msg.guild.id}\``,
          true
        )
        .addField(
          "By user",
          `${msg.author}  **${msg.author.tag}**  \`${msg.author.id}\``,
          true
        )
        .setTimestamp();
      bugs.send(embed);
    } catch (err) {}
    msg.channel.send(
      await message.translate(
        `${this.prefix} There was an unexpected error. This error has been automaticaly reported to the developers! Please try again.`
      )
    );
  }

  async saveFail(message, msg, err) {
    try {
      const bugs = this.client.channels.cache.get(
        this.client.bugReportsChannelID
      );
      const embed = new this.client.embed()
        .setAuthor("An save fail occured!")
        .setColor(this.client.colours.red)
        .addField("Error", err.message)
        .addField(
          "In server",
          `**${msg.guild.name}** | \`${msg.guild.id}\``,
          true
        )
        .addField(
          "By user",
          `${msg.author} | **${msg.author.tag}** | \`${msg.author.id}\``,
          true
        )
        .setTimestamp();
      bugs.send(embed);
    } catch (err) {}
    msg.channel.send(
      await message.translate(
        `${this.prefix} There was an error saving your data. This error has been automaticaly reported to the developers! Please try again.`
      )
    );
  }

  async guildOnly(message, channel) {
    channel.send(
      await message.translate(
        `${this.prefix} Due to the function of that command it may only be used in a server and **not** direct messages!`
      )
    );
  }

  async creatorOnly(message, channel) {
    channel.send(
      await message.translate(
        `${this.prefix} That command is only accesable by developers!`
      )
    );
  }

  async cooldown(message, channel, startTime, cooldown) {
    const ms = require("ms");
    const time = ms(ms(cooldown) - (Date.now() - startTime), { long: true });
    channel.send(
      await message.translate(
        `${this.prefix} The cooldown for that command has not expired. Please wait **${time}** before using it again!`
      )
    );
  }

  async noArgs(message, guild, channel, commandName) {
    const prefix = await this.client.models.prefix.findOne({
      guildID: guild ? guild.id : ""
    });
    channel.send(
      await message.translate(
        `${this.prefix} That command requires arguments! Correct usage \`${
          prefix ? prefix.prefix : this.client.prefix
        }${commandName} ${
          this.client.cmd.commands.get(commandName).help.usage
        }\``
      )
    );
  }

  async invalidArgs(message, guild, channel, commandName) {
    const prefix = await this.client.models.prefix.findOne({
      guildID: guild ? guild.id : ""
    });
    channel.send(
      await message.translate(
        `${this.prefix} Invalid arguments! Correct usage \`${
          prefix ? prefix.prefix : this.client.prefix
        }${commandName} ${
          this.client.cmd.commands.get(commandName).help.usage
        }\``
      )
    );
  }

  async invalidTarget(message, channel) {
    channel.send(
      await message.translate(
        `${this.client.config.msgPrefixes.warning} I could not get a target for that command! Please try again!`
      )
    );
  }

  async noClientPerms(message, msg, permissions) {
    if (permission === "SEND_MESSAGES") {
      msg.author.send(
        await message.translate(
          `${this.prefix} I do not have the \`${
            permissions.length ? permissions.join(", ") : permissions
          }\` permission(s) to execute that command. Please make sure I have the right permissions in **${
            msg.guild.name
          }**!`
        )
      );
    } else
      msg.channel.send(
        await message.translate(
          `${this.prefix} I do not have the \`${
            permissions.length ? permissions.join(", ") : permissions
          }\` permission(s) to execute that command. Please make sure I have the right permissions and that the target member's role is below my role!`
        )
      );
  }

  async noPerms(message, channel, permission) {
    channel.send(
      await message.translate(
        `${this.prefix} You are lacking the \`${permission}\` permission(s) to use that command!`
      )
    );
  }

  async voiceChannelOnly(message, channel) {
    channel.send(
      await message.translate(
        `${this.prefix} That command may only be run while you are in a voice channel!`
      )
    );
  }
};
