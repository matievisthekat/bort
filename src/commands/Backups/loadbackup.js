const Command = require('../../structures/base/Command')
const backups = require('discord-backup')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'loadbackup',
      category: 'Backups',
      description: 'Load a backup',
      usage: '{backup_id}',
      examples: ['735794717203234816'],
      cooldown: '30m',
      guildOnlyCooldown: true,
      requiresArgs: true,
      requiredPerms: ['ADMINISTRATOR'],
      requiredClientPerms: ['ADMINISTRATOR']
    })
  }

  async run (msg, args, flags) {
    const m = await msg.channel.send(msg.loading('Fetching backup...'))

    backups.fetch(args[0]).then(async (data) => {
      if (!data.id || !data.data) { return await m.edit(msg.warning('No backup foudn with that ID!')) }

      backups
        .load(data.id, msg.guild, {
          clearGuildBeforeRestore: true
        })
        .then(async () => {
          await backups.remove(data.id)
          await m.edit(msg.success(`Loaded backup \`${data.id}\``))
        })
    })
  }
}
