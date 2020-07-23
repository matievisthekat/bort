const Command = require('../../structures/base/Command')

module.exports = class Choose extends Command {
  constructor () {
    super({
      name: 'choose',
      aliases: ['option'],
      category: 'Utility',
      description:
        "Make the bot choose between multiple options\nThe options need to be divided by '|' symbols",
      usage: '{options}',
      examples: [
        'this and that | that and who',
        'cats | dogs',
        'me and you | you and him'
      ]

    })
  }

  async run (msg, args, flags) {
    const choice = msg.client.util.chooseString(args.join(' '))
    await msg.channel.send(`I choose **${choice.replace(/@/gi, '@\u200b')}**!`)
  }
}
