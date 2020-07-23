const Command = require('../../structures/base/Command')
const { Util } = require('discord.js')

module.exports = class Exec extends Command {
  constructor () {
    super({
      name: 'exec',
      aliases: ['execute'],
      category: 'Developer',
      description: 'Execute a command',
      usage: '{cmd}',
      examples: ['node -y', 'nginx -t'],
      creatorOnly: true
    })
  }

  async run (msg, args, flags) {
    const options = {
      split: {
        char: '\n',
        prepend: '```\n',
        append: '```'
      }
    }

    const m = await msg.channel.send(msg.loading('Running command...'))
    const res = await msg.client.util.execute(args.join(' '))

    if (res.stdout) {
      msg.channel.send(
        '```js\n' + Util.escapeCodeBlock(res.stdout) + '```',
        options
      )
    }
    if (res.stdin) {
      msg.channel.send(
        '```js\n' + Util.escapeCodeBlock(res.stdin) + '```',
        options
      )
    }
    if (res.stderr) {
      msg.channel.send(
        '```js\n' + Util.escapeCodeBlock(res.stderr) + '```',
        options
      )
    }

    m.edit(msg.success('Command successfully run'))
  }
}
