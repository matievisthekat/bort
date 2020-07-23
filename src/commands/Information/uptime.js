const Command = require('../../structures/base/Command')

module.exports = class Uptime extends Command {
  constructor () {
    super({
      name: 'uptime',
      category: 'Information',
      description:
        'View the amount of time since the last restart and the uptime of the process',
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const embed = new msg.client.Embed()
      .addField(
        'Bot Uptime',
        msg.client.util.ms(msg.client.uptime, { long: true })
      )
      .addField(
        'Process Uptime',
        msg.client.util.ms(
          msg.client.util.ms(`${process.uptime().toString().split('.')[0]}s`),
          { long: true }
        )
      )

    msg.channel.send(embed)
  }
}
