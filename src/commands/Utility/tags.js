const Command = require("../../structures/base/Command");

module.exports = class Tags extends Command {
  constructor() {
    super({
      name: "tags",
      category: "Utility",
      description: "View available tags",
      flags: ["embed"],
      examples: [" --embed", ""],
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const tags = msg.client.config.tags.map((t) => t.name).join(", ");
    if (flags["embed"])
      return msg.channel.send(new msg.client.embed().setDescription(tags).setAuthor("Available Tags", msg.client.user.displayAvatarURL()));
    else return msg.channel.send(`__**Available Tags**__\n${tags}`);
  }
};
