const Command = require('../../structures/base/Command')

module.exports = class Dashboard extends Command {
  constructor () {
    super({
      name: 'dashboard',
      category: 'Core',
      description: 'Get a link to the dashboard for the current server',
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const url = `https://bort.matievisthekat.dev/dashboard/${msg.guild.id}`
    msg.channel.send(url)
  }
}
