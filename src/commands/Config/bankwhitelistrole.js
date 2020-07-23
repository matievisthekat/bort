const Command = require('../../structures/base/Command')

module.exports = class BankWhitelistRole extends Command {
  constructor () {
    super({
      name: 'bankwhitelistrole',
      aliases: ['bankwlrole'],
      category: 'Config',
      description:
        "Set the whitelist role for this guild bank. Use 'none' to remove the whitelist role",
      usage: '{role}',
      examples: ['@Withraw', '700415014313525389', 'none'],
      guildOnlyCooldown: true,
      requiredPerms: ['MANAGE_GUILD'],
      currency: true
    })
  }

  async run (msg, args, flags) {
    if (args[0].toLowerCase() === 'none') {
      await msg.guild.bank.removeRole()

      await msg.channel.send(
        msg.success('Removed the whitelist role for this bank')
      )
    } else {
      const role = await msg.client.resolve('role', args.join(' '), msg.guild)
      if (!role) return await msg.client.errors.invalidTarget(msg, msg.channel)

      await msg.guild.bank.setRole(role.id)

      await msg.channel.send(
        msg.success(`Set **${role.name}** as the whitelist role for this bank`)
      )
    }
  }
}
