const Command = require('../../structures/base/Command')

module.exports = class Gamble extends Command {
  constructor () {
    super({
      name: 'gamble',
      aliases: ['bet'],
      category: 'Currency',
      description: "Gamble coins. Lost coins go to the server's bank",
      usage: '{amount}',
      cooldown: '5s',
      requiresArgs: true,
      guildOnly: true,
      currency: true
    })
  }

  async run (msg, args, flags) {
    if (
      !msg.author.currency ||
      !msg.author.currency.wallet ||
      msg.author.currency.wallet < 1
    ) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You don't have any money to gamble!"
      )
    }

    const amount = ['max', 'all'].includes(args[0].toLowerCase())
      ? msg.author.currency.wallet
      : parseInt(args[0])

    if (!amount || amount < 0) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You need to specifiy a valid amount to gamble!'
      )
    }

    if (amount > msg.author.currency.wallet) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You cannot gamble more than you have!'
      )
    }

    const chance = msg.client.util.randomInRange(0, 100)
    if (chance > 50) {
      await win(amount, msg.author)
      msg.channel.send(
        msg.success(
          `You won ${
            msg.client.emoji.coin
          }${amount.toLocaleString()}! Well done`
        )
      )
    } else {
      await lose(amount, msg.author, msg.guild)
      msg.channel.send(
        msg.warning(
          `You lost ${
            msg.client.emoji.coin
          }${amount.toLocaleString()}! Better luck next time`
        )
      )
    }
  }
}

async function win (amount, author) {
  await author.currency.add(amount)
}

async function lose (amount, author, guild) {
  await author.currency.remove(amount)
  await guild.bank.add(amount)
}
