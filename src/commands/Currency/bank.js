const Command = require("../../structures/base/Command");

module.exports = class Bank extends Command {
  constructor() {
    super({
      name: "bank",
      aliases: ["serverbank"],
      category: "Currency",
      description: "View the current server's bank",
      requiresArgs: false,
      guildOnly: true,
      currency: true
    });
  }

  async run(msg, args, flags) {
    const bank = msg.guild.bank;
    if (!bank)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        `There is no bank loaded for this server! Please contact ${msg.client.config.creators.tags[0]} to fix this!`
      );

    const blMembers = bank.blacklistedMemberIDs
      .map((id) => msg.guild.members.cache.get(id))
      .join(", ");
    const wlMembers = bank.whitelistedMemberIDs
      .map((id) => msg.guild.members.cache.get(id))
      .join(", ");

    const embed = new msg.client.embed()
      .setAuthor(msg.guild.name, msg.guild.iconURL())
      .setFooter(`Requested by ${msg.author.tag}`)
      .setTimestamp()
      .addField(
        "General",
        `**Amount:** ${bank.amount.toLocaleString()}\n**Max Withdrawal Amount:** ${bank.maxWithdrawAmount.toLocaleString()}`
      )
      .addField(
        "Information",
        `**Blacklisted Members:** ${
          blMembers || "[ None ]"
        }\n**Whitelisted Members:** ${
          wlMembers || "[ None ]"
        }\n**Whitelisted Role**: ${
          msg.guild.roles.cache.get(bank.allowedRoleID) || "[ None ]"
        }`
      );

    msg.channel.send(embed);
  }
};
