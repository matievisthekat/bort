const Command = require("../../structures/base/Command");

module.exports = class PostChannel extends Command {
  constructor() {
    super({
      name: "postchannel",
      aliases: ["pc"],
      category: "Config",
      description: "Set the channel to receive posts. Default flags: public",
      usage: "[set | get] <channel>",
      examples: [
        "set #posts --private",
        "get",
        "set #posts",
        "set --public #posts"
      ],
      flags: ["public", "private"],
      requiredPerms: ["MANAGE_CHANNELS"]
    });
  }

  async run(msg, args, flags) {
    let data = await msg.client.models.postChannel.findOne({
      guildID: msg.guild.id
    });

    switch (args[0].toLowerCase()) {
      case "get":
        msg.channel.send(
          data !== null
            ? msg.success(
                `The set post channel is ${
                  msg.guild.channels.cache.get(data.channelID) || `\`[ None ]\``
                } with a state of ${data.public ? "`Public`" : "Private"}`
              )
            : msg.warning("No post channel data was found for this server")
        );
        break;

      case "set":
        const channel = await msg.client.resolve("channel", args[1], msg.guild);
        if (channel == null)
          return msg.client.errors.invalidTarget(msg, msg.channel);

        if (data === null)
          data = new msg.client.models.postChannel({
            guildID: msg.guild.id
          });

        data.channelID = channel.id;
        data.public = flags["private"] ? false : true;

        msg.channel.send(
          msg.success(
            `${channel} has been set as the posts channel for this server`
          )
        );

        data.save().catch((err) => {
          msg.client.logger.error(err, true);
          msg.client.errors.saveFailr(msg, msg, err);
        });
        break;

      case "delete":
        if (data === null)
          return await msg.client.errors.custom(
            msg,
            msg.channel,
            "There is no post channel set!"
          );

        data.delete();

        msg.channel.send(msg.success("The post channel data has been deleted"));
        break;

      default:
        msg.client.errors.invalidArgs(msg, msg.channel, this.help.name);
        break;
    }
  }
};
