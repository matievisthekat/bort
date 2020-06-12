const Command = require("../../structures/base/Command");

module.exports = class Exec extends Command {
  constructor() {
    super({
      name: "exec",
      aliases: ["execute"],
      category: "Developer",
      description: "Execute a command",
      usage: "{cmd}",
      examples: ["node -y", "nginx -t"],
      guildOnly: false,
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Running command..."));

    const res = await msg.client.util.execute(args.join(" "));
    const embed = new msg.client.embed();

    embed.green.addField("Output", `\`\`\`${res.output || res.error}\`\`\``);

    m.edit(embed);
  }
};
