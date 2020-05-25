const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "suggestions",
      category: "Config",
      description: "Set or get the channel for suggestions",
      usage: "{set | get} <channel>",
      examples: ["get", "set #suggestions"],
      requiredPerms: ["MANAGE_CHANNELS"]
    });
  }

  async run(msg, args, flags) {
    switch (args[0].toLowerCase()) {
      case "get":
        const pData = await msg.client.models.suggestionChannel.findOne({
          guildID: msg.guild.id
        });

        if (!pData)
          return msg.channel.send(
            msg.warning("There is no suggestions channel set!")
          );

        msg.channel.send(
          msg.success(`Suggestions are currently set to <#${pData.channelID}>`)
        );
        break;

      case "set":
        const chan = await msg.client.resolve(
          "channel",
          args.slice(1).join(" "),
          msg.guild
        );
        if (!chan) return msg.client.errors.invalidTarget(msg, msg.channel);

        const data =
          (await msg.client.models.suggestionChannel.findOne({
            guildID: msg.guild.id
          })) ||
          new msg.client.models.suggestionChannel({
            guildID: msg.guild.id
          });

        data.channelID = chan.id;

        await data.save().catch((err) => {
          msg.client.logger.log(err);
          return msg.client.errors.saveFailr(msg, msg, err);
        });

        msg.channel.send(
          msg.success(`Suggestions will be redirected to <#${chan.id}>`)
        );
        break;

      default:
        msg.client.errors.invalidArgs(msg, msg.guild, msg.channel, this.help.name);
        break;
    }
  }
};
