const Command = require("../../structures/base/Command");

module.exports = class BuyNick extends Command {
  constructor() {
    super({
      name: "buynick",
      aliases: ["nick"],
      category: "Currency",
      description: "Buy a new nickname for yourself",
      usage: "{nickname}",
      examples: ["big boi man", "me me big boy", "matievisthebot"],
      cooldown: "10s",
      currency: true
    });
  }

  async run(msg, args, flags) {
    const serverData = (await msg.client.models.nicknamePrice.findOne({
      guildID: msg.guild.id
    })) || { price: 100 };

    if (serverData.price > msg.author.currency.wallet)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You don't have anough coins to purchase a nickname on this server!"
      );

    const nick = args.join(" ");

    try {
      await msg.member.setNickname(nick);

      await msg.guild.bank.deposit({
        amount: serverData.price,
        userID: msg.author.id
      });

      msg.channel.send(
        msg.success(
          `I have set your nickname to **${nick}** and ${msg.client.emoji.coin}${serverData.price} was transfered to this server's bank from your wallet`
        )
      );
    } catch (err) {
      await msg.client.errors.custom(msg, 
        msg.channel,
        "I cannot change your nickanme! Talk to a server admin to fix this"
      );
    }
  }
};
