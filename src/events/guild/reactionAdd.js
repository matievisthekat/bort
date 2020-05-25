const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("messageReactionAdd");
  }

  async run(client, r, u) {
    if (r.partial) await r.fetch();
    const msg = r.message;
    if (msg.partial) await msg.fetch();
    if (u.partial) await u.fetch();

    if (u.bot) return;

    await handlePosts(msg, r, u);
    await handleReactionRoles(msg, r, u);
  }
};

async function handleReactionRoles(msg, r, u) {
  if (!msg.guild) return;

  const rr =
    (await msg.client.models.reactionrole.findOne({
      messageID: msg.id,
      guildID: msg.guild.id,
      emoji: r.emoji.name
    })) ||
    (await msg.client.models.reactionrole.findOne({
      messageID: msg.id,
      guildID: msg.guild.id,
      emoji: r.emoji.id
    }));
  if (!rr) return;

  const role = await msg.guild.roles.cache.get(rr.roleID);
  if (!role) {
    await msg.reactions.remove(rr.emoji);
    return await rr.delete();
  }

  try {
    await msg.guild.members.resolve(u.id).roles.add(role.id);
  } catch (err) {
    u.send(
      `I failed to add **${role.name}** to you in \`${msg.guild.name}\`! Alert a server admin to fix this`
    ).catch(() => {});
  }
}

async function handlePosts(msg, r, u) {
  if (!msg.guild) return;

  const data = await msg.client.models.post.findOne({
    postMessageID: msg.id
  });

  if (data !== null && msg.author.id === msg.client.user.id) {
    const profile = await msg.client.models.profile.findOne({
      userID: data.userID
    });

    let downvoteStr;
    let downvoteNumber;
    let upvoteStr;
    let upvoteNumber;

    switch (r.emoji.id) {
      case msg.client.emoji.upvote.split(":")[2].slice(0, -1):
        downvoteStr = msg.content
          .split(" | ")[1]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2);
        downvoteNumber = downvoteStr.substring(0, downvoteStr.length - 2);

        upvoteStr = msg.content
          .split(" | ")[0]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2);
        upvoteNumber = parseInt(upvoteStr.substring(0, upvoteStr.length - 2));

        msg.edit(
          `${msg.client.emoji.upvote} **${upvoteNumber + 1}** | ${
            msg.client.emoji.downvote
          } **${downvoteNumber}**`
        );

        msg.reactions.cache
          .get(msg.client.emoji.downvote.split(":")[2].slice(0, -1))
          .users.remove(u.id);

        if (data !== null) data.upvotes++;

        if (profile !== null) profile.karma++;

        break;
      case msg.client.emoji.downvote.split(":")[2].slice(0, -1):
        downvoteStr = msg.content
          .split(" | ")[1]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2);
        downvoteNumber = downvoteStr.substring(0, downvoteStr.length - 2);

        upvoteStr = msg.content
          .split(" | ")[0]
          .split(/ +/g)[1]
          .substring(0, msg.content.length - 2)
          .slice(2);
        upvoteNumber = parseInt(upvoteStr.substring(0, upvoteStr.length - 2));

        msg.edit(
          `${msg.client.emoji.upvote} **${upvoteNumber}** | ${
            msg.client.emoji.downvote
          } **${downvoteNumber - 1}**`
        );

        msg.reactions.cache
          .get(msg.client.emoji.upvote.split(":")[2].slice(0, -1))
          .users.remove(u.id);

        if (data !== null) data.upvotes++;

        if (profile !== null) profile.karma--;

        break;
    }
    if (data !== null) data.save().catch((err) => msg.client.logger.error(err));

    if (profile !== null)
      profile.save().catch((err) => msg.client.logger.error(err));
  }
}
