const Command = require('../../structures/base/Command')
const mongoose = require('mongoose')

module.exports = class Ping extends Command {
  constructor () {
    super({
      name: 'ping',
      aliases: ['pong'],
      category: 'Information',
      description: 'View the latency of the bot, database and Discord',
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    msg.channel
      .send(`${msg.client.emoji.generating} Pinging...`)
      .then(async (m) => {
        const msgPing = m.createdTimestamp - msg.createdTimestamp
        const dbConnect = Date.now()

        await mongoose.connect(msg.client.uri, {
          useNewUrlParser: true,
          useUnifiedTopology: true
        })

        const dbDone = Date.now()

        const embed = new msg.client.Embed()
          .setDescription(msg.emojify('pong!'))
          .addField(
            'Message',
            `\`\`\`ini\n[ ${msg.client.util.ms(msgPing, {
              long: true
            })} ]\`\`\``,
            true
          )
          .addField(
            'Database',
            `\`\`\`ini\n[ ${msg.client.util.ms(dbDone - dbConnect, {
              long: true
            })} ]\`\`\``,
            true
          )
          .addField(
            'Discord',
            `\`\`\`ini\n[ ${msg.client.util.ms(msg.client.ws.ping, {
              long: true
            })} ]\`\`\``,
            true
          )

        m.edit('', embed)
      })
  }
}
