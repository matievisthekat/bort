const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "clap",
      category: "Utility",
      description: "Clapify a message!",
      usage: "{text}",
      examples: ["o o f", "clapping is nice"],
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const clapped = msg.client.util.clapString(args.join(" "));
    msg.channel.send(clapped.replace(/@/gi, "@\u200b") || "Nothing to show");
  }
};
