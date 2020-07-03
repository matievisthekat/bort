const Command = require("../../structures/base/Command");

module.exports = class BankWhitelist extends Command {
  constructor() {
    super({
      name: "bankwhitelist",
      aliases: ["bankwl"],
      category: "Config",
      description: "Whitelist a member from withdrawing from the guild bank",
      usage: "{member}",
      examples: ["@MatievisTheKat", "matievis the kat", "492708936290402305"],
      guildOnlyCooldown: true,
      requiredPerms: ["MANAGE_GUILD"],
      currency: true
    });
  }

  async run(msg, args, flags) {
    const target = await msg.client.resolve(
      "member",
      args.join(" "),
      msg.guild
    );
    if (!target) return await msg.client.errors.invalidTarget(msg, msg.channel);

    if (msg.guild.bank.whitelistedMemberIDs.includes(target.user.id))
      return await msg.channel.send(
        msg.warning("That member is already whitelisted!")
      );

    await msg.guild.bank.whitelist(target.user.id);

    await msg.channel.send(
      msg.success(`Whitelisted **${target.user.tag}** for this bank`)
    );
  }
};
