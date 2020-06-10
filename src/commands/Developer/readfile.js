const Command = require("../../structures/base/Command");
const { join } = require("path");
const fs = require("fs");
const util = require("util");

module.exports = class ReadFile extends Command {
  constructor() {
    super({
      name: "readfile",
      aliases: ["rf"],
      category: "Developer",
      description: "Read a file",
      usage: "{path}",
      examples: ["/src/commands/Developer/readfile.js", ".gitignore"],
      guildOnly: false,
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const path = join(__dirname, "..", "..", "..", `/${args.join(" ")}`);
    const options = {
      split: {
        char: "\n",
        prepend: "```js\n",
        append: "```"
      }
    };

    try {
      const content = fs.readFileSync(path, "utf8");
      const result = content; //require("util").inspect(content);
      msg.channel.send(`\`\`\`js\n${result}\`\`\``, options);
    } catch (err) {
      msg.channel.send(msg.error(err.message));
    }
  }
};
