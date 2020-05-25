const Command = require("../../structures/base/Command");

module.exports = class Blacklist extends Command {
  constructor() {
    super({
      name: "blacklist",
      aliases: ["bl"],
      category: "Developer",
      description: "View, add and remove blacklists",
      usage: "{view | add | remove} <id> <reason>",
      examples: [
        "add 492708936290402305 bad boi",
        "remove 492708936290402305 gud boi",
        "view 492708936290402305"
      ],
      creatorOnly: true
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Loading..."));

    switch (args[0].toLowerCase()) {
      case "add":
        if (!args[1]) {
          if (m.deletable) m.delete();
          return msg.client.errors.invalidArgs(msg, 
            msg.guild,
            msg.channel,
            this.help.name
          );
        }

        const addRes = await msg.client.blacklist.add({
          id: args[1],
          reason: args.slice(2).join(" ") || "No reason specified"
        });

        if (addRes.status === 200) m.edit(msg.success(addRes.message));
        else if (addRes.status === 500) m.edit(msg.error(addRes.message));
        else m.edit(msg.warning(addRes.message));
        break;

      case "remove":
        if (!args[1]) {
          if (m.deletable) m.delete();
          return msg.client.errors.invalidArgs(msg, 
            msg.guild,
            msg.channel,
            this.help.name
          );
        }

        const remRes = await msg.client.blacklist.remove({
          id: args[1],
          reason: args.slice(2).join(" ") || "No reason specified"
        });

        if (remRes.status === 200) m.edit(msg.success(remRes.message));
        else if (remRes.status === 500) m.edit(msg.error(remRes.message));
        else m.edit(msg.warning(remRes.message));
        break;

      case "view":
        if (!args[1]) {
          if (m.deletable) m.delete();
          return msg.client.errors.invalidArgs(msg, 
            msg.guild,
            msg.channel,
            this.help.name
          );
        }

        const viewRes = await msg.client.blacklist.get(args[1]);

        if (viewRes.status === 200) m.edit(msg.success(viewRes.message));
        else if (viewRes.status === 500) m.edit(msg.error(viewRes.message));
        else m.edit(msg.warning(viewRes.message));
        break;

      case "list":
        const bls = await msg.client.models.blacklist.find();

        const embed = new msg.client.embed().setDescription(
          bls.map((b) => {
            const resolved =
              msg.client.users.cache.get(b.id) ||
              msg.client.guilds.cache.get(b.id);

            return `**${resolved.name || resolved.username || "N/A"}** (${
              resolved.username ? "User" : "Guild"
            }) **:** ${b.id}`;
          })
        );

        m.edit(`**${bls.length} Total blacklists**`, embed);
        break;

      default:
        if (m.deletable) m.delete();
        msg.client.errors.invalidArgs(msg, msg.guild, msg.channel, this.help.name);
        break;
    }
  }
};
