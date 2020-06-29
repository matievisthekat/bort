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
    const options = {
      split: {
        char: "\n",
        prepend: "```\n",
        append: "```"
      }
    };

    const m = await msg.channel.send(msg.loading("Running command..."));
    const res = await msg.client.util.execute(args.join(" "));

    if (res.stdout) msg.channel.send(`\`\`\`\n${res.stdout}\`\`\``, options);
    if (res.stdin) msg.channel.send(`\`\`\`\n${res.stdin}\`\`\``, options);
    if (res.stderr) msg.channel.send(`\`\`\`\n${res.stderr}\`\`\``, options);

    m.edit(msg.success("Command successfully run"));
  }
};
