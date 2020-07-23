const Command = require('../../structures/base/Command')

module.exports = class Deposit extends Command {
  constructor () {
    super({
      name: 'deposit',
      aliases: ['dep'],
      category: 'Currency',
      description: 'Deposit coins into your bank',
      usage: '{amount | all}',
      examples: ['100', 'all', 'max'],
      cooldown: '5s',
      currency: true
    })
  }

  async run (msg, args, flags) {
    let amount = ['all', 'max'].includes(args[0].toLowerCase())
      ? msg.author.currency.wallet
      : parseInt(args[0])

    if (amount === 0) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        "You don't have any money to deposit"
      )
    }

    if (!amount) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You need to supply an amount to deposit'
      )
    }

    if (amount < 0) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You may not deposit negative amounts'
      )
    }

    if (amount > msg.author.currency.model.wallet) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You may not deposit more than you have. Nice try though ;)'
      )
    }

    if (msg.author.currency.bank === msg.author.currency.bankLimit) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'Your bank is full! Level up to earn more space'
      )
    }

    if (msg.author.currency.bank + amount > msg.author.currency.bankLimit) {
      amount -=
        msg.author.currency.bank + amount - msg.author.currency.bankLimit
    }

    await msg.author.currency.deposit(amount)

    msg.channel.send(
      msg.success(`Deposited ${amount.toLocaleString()} coins into your bank`)
    )
  }
}
