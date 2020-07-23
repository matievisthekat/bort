const Command = require('../../structures/base/Command')

module.exports = class Chill extends Command {
  constructor () {
    super({
      name: 'pop',
      category: 'Music',
      description:
        'Play an endless stream of chill music from twitch.tv/musiknation',
      guildOnlyCooldown: true,
      requiresArgs: false,
      guildOnly: true,
      voiceChannelOnly: true
    })
  }

  async run (msg, args, flags) {
    new (require('./genre'))().run(msg, ['pop'], {})
  }
}
