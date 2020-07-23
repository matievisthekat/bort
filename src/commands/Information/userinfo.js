const Command = require('../../structures/base/Command')

module.exports = class UserInfo extends Command {
  constructor () {
    super({
      name: 'userinfo',
      aliases: ['ui', 'whois', 'i', 'info'],
      category: 'Information',
      description: 'View information on a user',
      usage: '<user>',
      examples: ['MatievisTheKat', 'the kat', '@MatievisTheKat#4975'],
      requiresArgs: false
    })
  }

  async run (msg, args, flags) {
    const m = await msg.channel.send(msg.loading('Fetching user...'))

    const target =
      (await msg.client.resolve(
        'member',
        args.join(' ') || msg.author.toString(),
        msg.guild
      )) ||
      (await msg.client.resolve(
        'user',
        args.join(' ') || msg.author.toString(),
        msg.guild
      ))

    if (!target) {
      m.delete().catch((err) => msg.client.logger.error(err))
      return msg.client.errors.invalidTarget(msg, msg.channel)
    }

    const thumbnailOptions = {
      size: 512,
      dynamic: true,
      format: 'png'
    }

    const statuses = {
      dnd: `${msg.client.emoji.dnd} Do not Disturb`,
      idle: `${msg.client.emoji.idle} Idle`,
      online: `${msg.client.emoji.online} Online`
    }

    const platforms = {
      web: 'Web App',
      desktop: 'Desktop App',
      mobile: 'Mobile App'
    }

    const platform =
      platforms[Object.keys(target.presence.clientStatus || {})] || 'Not found'

    const embed = new msg.client.Embed()
      .setColor(
        target.roles
          ? target.roles.cache.highest
            ? target.roles.cache.highest.color
            : msg.client.colours.def
          : msg.client.colours.def
      )
      .setThumbnail(
        target.user
          ? target.user.displayAvatarURL(thumbnailOptions)
          : target.displayAvatarURL(thumbnailOptions)
      )
      .addField(
        target.user ? 'Member' : 'User',
        `${target.toString()} **:** ${target.tag || target.user.tag} **:** ${
          target.id || target.user.id
        }\n**Rank:** ${calcRank(
          msg.client,
          target.user ? target.user.id : target.id
        )}`
      )
      .addField(
        'Relevant Dates',
        `↳ :hammer_pick: **Created** ${
          msg.client.util
            .moment(
              target.user
                ? target.user.createdTimestamp
                : target.createdTimestamp
            )
            .from(Date.now()) || '[ Not applicable ]'
        }${
          target.user
            ? `\n↳ :inbox_tray: **Joined** ${
                msg.client.util.moment(target.joinedAt).from(Date.now()) ||
                '[ Not applicable ]'
              }`
            : ''
        }`
      )
      .addField(
        'Activity',
        `↳ ${msg.client.emoji.messages} **Last message** in ${
          target.user
            ? target.user.lastMessage
              ? `\`#${target.user.lastMessage.channel.name}\``
              : '[ Not found ]'
            : target.lastMessage
            ? `\`#${target.lastMessage.channel.name}\``
            : '[ Not found ]'
        } on ${
          target.user
            ? target.user.lastMessage
              ? `**${
                  target.user.lastMessage.guild.name
                }** ${msg.client.util
                  .moment(target.user.lastMessage.createdAt)
                  .from(Date.now())}`
              : '[ Not found ]'
            : target.lastMessage
            ? `**${target.lastMessage.guild.name}** ${msg.client.util
                .moment(target.lastMessage.createdAt)
                .from(Date.now())}`
            : '[ Not found ]'
        }\n↳ **${
          statuses[
            target.user ? target.user.presence.status : target.presence.status
          ] || `${msg.client.emoji.offline} Offline`
        }** on the ${platform}`
      )
      .setFooter(`Requested by ${msg.author.tag}`)
      .setTimestamp()

    m.edit('', embed)
  }
}

function calcRank (client, id) {
  if (client.config.creators.ids.includes(id)) return client.emoji.brand
  else if (client.config.staff.ids.includes(id)) return client.emoji.staffBadge
  else return client.emoji.user
}
