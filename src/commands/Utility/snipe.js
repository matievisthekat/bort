const Command = require('../../structures/base/Command')

module.exports = class Snipe extends Command {
  constructor () {
    super({
      name: 'snipe',
      aliases: ['s'],
      category: 'Utility',
      description: 'Snipe a recently deleted message from that channel',
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const snipe = msg.client.snipeMessages.get(msg.channel.id)

    if (!snipe) { return msg.channel.send(msg.warning('Theres nothing to snipe!')) }

    msg.channel.send(
      new msg.client.Embed()
        .setAuthor(
          snipe.author.tag,
          snipe.author.displayAvatarURL({ dynamic: true })
        )
        .setDescription(snipe.content || '[ No content ]')
    )
  }
}
