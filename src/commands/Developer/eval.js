const Command = require("../../structures/base/Command");

module.exports = class Eval extends Command {
  constructor() {
    super({
      name: "eval",
      aliases: ["e"],
      category: "Developer",
      description: "Evaluate some code",
      usage: "{evaluation}",
      examples: [
        "msg.channel.send('hi');",
        "msg.client.emit('guildCreate', msg.author);"
      ],
      guildOnly: false,
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const options = {
      split: {
        char: "\n",
        prepend: "```js\n",
        append: "```"
      }
    };

    const match = args[0].match(/--(depth)=(\d+)/gi);
    const depth = match && match[0] === "depth" ? parseInt(match[0]) : 0;

    let content = args.slice(match ? 1 : 0).join(" ");

    if (content.includes("await")) content = `(async () => {${content}})();`;

    const result = new Promise((resolve, reject) => resolve(eval(content)));

    return result
      .then((output) => {
        if (typeof output !== "string")
          output = require("util").inspect(output, { depth });

        if (output.includes(msg.client.token))
          output = output.replace(msg.client.token, "T0K3N");

        msg.channel.send(`\`\`\`js\n${output}\`\`\``, options);
      })
      .catch((err) => {
        err.stack = err.stack
          .replace(msg.client.token, "Cleint Token")
          .replace(msg.client.uri, "MongoDB URI");

        msg.channel.send(`\`\`\`js\n${err.stack}\`\`\``, options);
      });
  }
};
