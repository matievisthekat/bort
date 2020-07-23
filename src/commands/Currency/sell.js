const Command = require('../../structures/base/Command')

module.exports = class Sell extends Command {
  constructor () {
    super({
      name: 'sell',
      category: 'Currency',
      description: 'Sell some of your hard earned items',
      usage: '{item ID}',
      flags: ['all'],
      examples: ['dog', 'ultrachicken --all'],
      currency: true
    })
  }

  async run (msg, args, flags) {
    const data = await msg.client.models.Inv.findOne({
      userID: msg.author.id
    })
    if (!data) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You currently do not own any items!'
      )
    }

    const items = data.inv.filter(
      (i) => i.name.toLowerCase().replace(/ +/gi, '') === args[0].toLowerCase()
    )
    if (!items || !items[0]) {
      return msg.client.errors.custom(
        msg,
        msg.channel,
        'You do not own that item or it is not a valid item ID!'
      )
    }

    if (flags.all) for (const item of items) data.inv.splice(data.inv.indexOf(item), 1)
    else data.inv.splice(data.inv.indexOf(items[0]), 1)

    const price = flags.all ? items.reduce(function (p, c) { p += c.price }, 0) : items[0].price

    await data.save()
    await msg.author.currency.add(price)

    msg.channel.send(
      msg.success(
        `You sold ${flags.all ? items.length : 'one'} **${args[0].toLowerCase()}** for ${
        msg.client.emoji.coin
        }${price.toLocaleString()}`
      )
    )
  }
}
