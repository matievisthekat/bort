const Command = require("../../structures/base/Command");

module.exports = class MentionRole extends Command {
  constructor() {
    super({
      name: "mentionrole",
      aliases: ["menrole", "menr"],
      category: "Utility",
      description:
        "Mention an un-mentionable role without letting other members ping it",
      usage: "{role}",
      examples: ["announcements", "704368262871515216"],
      cooldown: "8s",
      guildOnlyCooldown: true,
      requiredPerms: ["MANAGE_ROLES"],
      requiredClientPerms: ["MANAGE_ROLES"]
    });
  }

  async run(msg, args, flags) {
    const role = await msg.client.resolve("role", args.join(" "), msg.guild);
    if (!role) return msg.client.errors.invalidTarget(msg, msg.channel);

    const previous = role.mentionable;

    try {
      await role.edit({ mentionable: true });
      await msg.channel.send(`**${msg.author.tag}** pinged ${role}`);
      await role.edit({ mentionable: previous });
    } catch (err) {
      await msg.client.errors.custom(msg, 
        msg.channel,
        "Failed to change settings for that role!"
      );
    }
  }
};
