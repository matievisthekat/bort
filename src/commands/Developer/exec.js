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
    const res = await msg.client.util.execute(args.join(" "));
    const embed = new msg.client.embed();

    if (res.error) {
      embed.red.addField("Error", `\`\`\`${res.error}\`\`\``);
    } else {
      embed.green.addField("Output", `\`\`\`${res.output}\`\`\``);
    }

    msg.channel.send(embed);
  }
};
