const Command = require("../../structures/base/Command");

module.exports = class Translate extends Command {
  constructor() {
    super({
      name: "translate",
      category: "Utility",
      description: "Translate between languages",
      usage: "{to} {text}",
      examples: ["fr Hello there", "en Bonjour"],
      cooldown: "15s",
      
    });
  }

  async run(msg, args, flags) {
    const to = msg.client.translator.langs.find(
      (lang) =>
        lang.name.toLowerCase() === args[0].toLowerCase() ||
        lang.code.toLowerCase() === args[0].toLowerCase()
    );
    if (!to)
      return msg.channel.send(
        msg.warning(
          `Invalid langauge selection! Use \`${await msg.prefix(
            false
          )}languages\` to view available languages!`
        )
      );

    const m = await msg.channel.send(
      msg.loading("Sending text to the server...")
    );

    const translated = await msg.client.translator.translate(
      args.slice(1).join(" "),
      to.code
    );

    m.edit(
      msg.success(translated.text.join(" ")) ||
        msg.warning(
          "Oops! Looks like the server didn't send a valid response! Try again later"
        )
    );
  }
};
