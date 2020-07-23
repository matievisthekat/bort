const Event = require('../../structures/base/Event')

module.exports = class extends Event {
  constructor () {
    super('messageReactionRemove')
  }

  async run (client, r, u) {
    if (r.partial) await r.fetch()
    const msg = r.message
    if (msg.partial) await msg.fetch()
    if (u.partial) await u.fetch()

    if (u.bot) return

    await handlePosts(msg, r, u)
    await handleReactionRoles(msg, r, u)
  }
}

async function handleReactionRoles (msg, r, u) {
  if (!msg.guild) return

  const rr =
    (await msg.client.models.Reactionrole.findOne({
      messageID: msg.id,
      guildID: msg.guild.id,
      emoji: r.emoji.name
    })) ||
    (await msg.client.models.Reactionrole.findOne({
      messageID: msg.id,
      guildID: msg.guild.id,
      emoji: r.emoji.id
    }))

  if (!rr) return

  const role = await msg.guild.roles.cache.get(rr.roleID)
  if (!role) {
    await msg.reactions.remove(rr.emoji)
    return await rr.delete()
  }

  try {
    await msg.guild.members.resolve(u.id).roles.remove(role.id)
  } catch (err) {
    u.send(
      `I failed to remove **${role.name}** from you in \`${msg.guild.name}\`! Alert a server admin to fix this`
    ).catch(() => {})
  }
}

async function handlePosts (msg, r, u) {
  const data = await msg.client.models.Post.findOne({
    postMessageID: msg.id
  })

  if (data !== null && msg.author.id === msg.client.user.id) {
    const profile = await msg.client.models.Profile.findOne({
      userID: data !== null ? data.userID : ''
    })

    let downvoteStr
    let downvoteNumber
    let upvoteStr
    let upvoteNumber
    switch (r.emoji.id) {
      case msg.client.emoji.upvote.split(':')[2].slice(0, -1):
        downvoteStr = msg.content
          .split(' | ')[1]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2)
        downvoteNumber = parseInt(
          downvoteStr.substring(0, downvoteStr.length - 2)
        )

        upvoteStr = msg.content
          .split(' | ')[0]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2)
        upvoteNumber = parseInt(upvoteStr.substring(0, upvoteStr.length - 2))

        await msg.edit(
          `${msg.client.emoji.upvote} **${upvoteNumber - 1}** | ${
            msg.client.emoji.downvote
          } **${downvoteNumber}**`
        )

        if (data !== null) data.upvotes--

        if (profile !== null) profile.karma--

        break
      case msg.client.emoji.downvote.split(':')[2].slice(0, -1):
        downvoteStr = msg.content
          .split(' | ')[1]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2)
        downvoteNumber = parseInt(
          downvoteStr.substring(0, downvoteStr.length - 2)
        )

        upvoteStr = msg.content
          .split(' | ')[0]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2)
        upvoteNumber = parseInt(upvoteStr.substring(0, upvoteStr.length - 2))

        await msg.edit(
          `${msg.client.emoji.upvote} **${upvoteNumber}** | ${
            msg.client.emoji.downvote
          } **${downvoteNumber + 1}**`
        )

        if (data !== null) data.upvotes--

        if (profile !== null) profile.karma++

        break
    }
    if (data !== null) data.save().catch((err) => msg.client.logger.error(err))

    if (profile !== null) { profile.save().catch((err) => msg.client.logger.error(err)) }
  }
}
