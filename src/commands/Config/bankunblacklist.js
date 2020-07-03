const Command = require("../../structures/base/Command");

module.exports = class BankUnBlacklist extends Command {
  constructor() {
    super({
      name: "bankunblacklist",
      aliases: ["bankunbl"],
      category: "Config",
      description: "Un-blacklist a member from withdrawing from the guild bank",
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

    if (!msg.guild.bank.blacklistedMemberIDs.includes(target.user.id))
      return await msg.channel.send(
        msg.warning("That member is not blacklisted!")
      );

    await msg.guild.bank.unBlacklist(target.user.id);

    await msg.channel.send(
      msg.success(
        `Un-blacklisted **${target.user.tag}** from withdrawing coins from the guild bank`
      )
    );
  }
};
