const Command = require("../../structures/base/Command");

module.exports = class MaxWithdraw extends Command {
  constructor() {
    super({
      name: "maxwithdraw",
      aliases: [
        "setmaxwithdrawamount",
        "maxwithamt",
        "maxwithdrawamt",
        "maxwith"
      ],
      category: "Config",
      description: "Set the max withdrawal amount for this guild's bank",
      usage: "{amount}",
      examples: ["100", "200"],
      requiredPerms: ["MANAGE_GUILD"],
      requriedClientPerms: ["MANAGE_GUILD"]
    });
  }

  async run(msg, args, flags) {
    const amt = parseInt(args.join(" "));
    if (!amt)
      return await msg.channel.send(
        msg.warning("You must supply a valid amount!")
      );

    await msg.guild.bank.setMaxWithdrawAmount(amt);

    await msg.channel.send(
      msg.success(
        `Set **${amt.toLocaleString()}** as the max withdrawal amount for this guild bank`
      )
    );
  }
};
