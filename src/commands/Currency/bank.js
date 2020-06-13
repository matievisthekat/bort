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
      await msg.client.errors.custom(msg, 
        msg.channel,
        `There is no bank loaded for this server! Please contact ${msg.client.config.creators.tags[0]} to fix this!`
      );

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
          bank.blacklistedMemberIDs
            .map(async (id) => (await msg.client.resolve("user", id)) || "")
            .join(", ") || "[ None ]"
        }\n**Whitelisted Members:** ${
          bank.whitelistedMemberIDs
            .map(async (id) => (await msg.client.resolve("user", id)) || "")
            .join(", ") || "[ None ]"
        }\n**Role** *(members with this role may withdraw coins)*: ${
          msg.guild.roles.cache.get(bank.allowedRoleID) || "[ None ]"
        }`
      );

    msg.channel.send(embed);
  }
};
