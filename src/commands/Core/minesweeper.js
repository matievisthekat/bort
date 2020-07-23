const Command = require('../../structures/base/Command')
const Minesweeper = require('discord.js-minesweeper')

module.exports = class Name extends Command {
  constructor () {
    super({
      name: 'minesweeper',
      aliases: ['ms'],
      category: 'Core',
      description: 'Play a game of minesweeper',
      requiresArgs: false

    })
  }

  async run (msg, args, flags) {
    const minesweeper = new Minesweeper({
      rows: 9,
      columns: 9,
      mines: 10,
      emote: 'boom',
      revealFirstCell: false,
      returnType: 'emoji'
    })
    const matrix = minesweeper.start()

    const embed = new msg.client.Embed().blue.setDescription(matrix)
    msg.channel.send(embed)
  }
}
