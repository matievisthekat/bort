const Command = require("../../structures/base/Command");

module.exports = class Reload extends Command {
  constructor() {
    super({
      name: "reload",
      category: "Developer",
      description: "Reload events, commands or a specific command",
      usage: "{full | events | commands | command} <command name>",
      examples: ["events", "commands", "command help", "command post"],
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Loading..."));
    switch (args[0] ? args[0].toLowerCase() : null) {
      case "events":
        msg.client.logger.warn("Force event reload");

        const eventResult = await msg.client.loadEvents;

        m.edit(msg.success(eventResult.message));

        break;

      case "commands":
        msg.client.logger.warn("Force commands reload");

        const commandsResult = await msg.client.cmd.loadCommands();

        m.edit(msg.success(commandsResult.message));

        break;

      case "command":
        const commandName = args.slice(1).join(" ");

        const commandResult = await msg.client.cmd.reloadCommand(commandName);

        if (commandResult.status === 500)
          m.edit(msg.error(commandResult.message));
        else if (commandResult.status === 200)
          m.edit(msg.success(commandResult.message));
        else if (commandResult.status === 404)
          m.edit(msg.warning(commandResult.message));

        break;

      default:
        const res = await msg.client.reload();
        m.edit(msg.success(res.message));
        break;
    }
  }
};
