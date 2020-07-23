const Command = require('../../structures/base/Command')

module.exports = class BankUnWhitelist extends Command {
  constructor () {
    super({
      name: 'bankunwhitelist',
      aliases: ['bankunwl'],
      category: 'Config',
      description: 'Un-whitelist a member from withdrawing from the guild bank',
      usage: '{member}',
      examples: ['@MatievisTheKat', 'matievis the kat', '492708936290402305'],
      guildOnlyCooldown: true,
      requiredPerms: ['MANAGE_GUILD'],
      currency: true
    })
  }

  async run (msg, args, flags) {
    const target = await msg.client.resolve(
      'member',
      args.join(' '),
      msg.guild
    )
    if (!target) return await msg.client.errors.invalidTarget(msg, msg.channel)

    if (!msg.guild.bank.whitelistedMemberIDs.includes(target.user.id)) {
      return await msg.channel.send(
        msg.warning('That member is not whitelisted!')
      )
    }

    await msg.guild.bank.unWhitelist(target.user.id)

    await msg.channel.send(
      msg.success(
        `Un-whitelisted **${target.user.tag}** from withdrawing coins from the guild bank`
      )
    )
  }
}
