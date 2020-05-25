const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "tag",
      aliases: ["t"],
      category: "Utility",
      description: "Use a tag",
      usage: "{tag name}",
      examples: ["free hosting", "token leak"],
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const tag = msg.client.config.tags.find(
      (t) => t.name.toLowerCase() === args.join(" ").toLowerCase()
    );
    if (!tag)
      return msg.channel.send(msg.warning("No tag with that name was found!"));

    msg.channel.send(new msg.client.embed().blue.setDescription(tag.content));
  }
};
