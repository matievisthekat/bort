const Command = require("../../structures/base/Command");

module.exports = class Post extends Command {
  constructor() {
    super({
      name: "post",
      category: "Core",
      description: "Post something to all servers with a post thread",
      usage: "{content}",
      examples: ["Hi am I cool?", "me me big boy --private"],
      cooldown: "30m"
    });
  }

  async run(msg, args, flags) {
    const posts = await msg.client.models.postChannel.findOne({
      guildID: msg.guild.id
    });

    const channel =
      posts !== null && posts.channelID !== null
        ? msg.guild.channels.cache.get(posts.channelID) || msg.channel
        : msg.channel;

    if (flags["nsfw"] && !channel.nsfw)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "You may only post NSFW content inside NSFW locked channels."
      );

    const post = new msg.client.embed()
      .setAuthor(msg.author.tag, msg.author.displayAvatarURL())
      .setTimestamp();

    if (args[0])
      post.setDescription(
        args.join(" ").length < 255
          ? args.join(" ")
          : args.join(" ").substring(0, 255)
      );

    if (msg.attachments.first()) post.setImage(msg.attachments.first().url);

    if (!msg.attachments.first() && !args[0])
      return msg.client.errors.noArgs(msg, msg.guild, msg.channel, "post");

    const intro = `${flags["nsfw"] ? "**__NSFW__**\t" : ""} ${
      msg.client.emoji.upvote
    } **0** | ${msg.client.emoji.downvote} **0**`;

    channel
      .send(intro, post)
      .then(async (m) => {
        if (m.channel.id !== msg.channel.id)
          msg.channel.send(
            msg.warning(`Your post has been redirected to ${channel}`)
          );

        await m.react(msg.client.emoji.upvote.split(":")[2].slice(0, -1));
        await m.react(msg.client.emoji.downvote.split(":")[2].slice(0, -1));

        if (msg.deletable) msg.delete();

        const postData = new msg.client.models.post({
          userID: msg.author.id,
          postMessageID: m.id,
          upvotes: 0,
          downvotes: 0
        });

        await postData
          .save()
          .catch(
            (err) =>
              msg.client.logger.error(err) &&
              msg.client.errors.saveFailr(msg, msg, err)
          );

        let profile = await msg.client.models.profile.findOne({
          userID: msg.author.id
        });

        if (profile === null)
          profile = new msg.client.models.profile({
            userID: msg.author.id,
            postCount: 0,
            karma: 0
          });

        profile.postCount += 1;

        profile.save().catch((err) => msg.client.logger.error(err));

        if (!flags["private"]) {
          for (const guild of msg.client.guilds.cache.array()) {
            const data = await msg.client.models.postChannel.findOne({
              guildID: guild.id,
              public: true
            });

            if (!data || !data.channelID) continue;

            const channel = guild.channels.cache.get(data.channelID);

            if (!channel) continue;

            try {
              channel.send(intro, post).then(async (m) => {
                await m.react(
                  msg.client.emoji.upvote.split(":")[2].slice(0, -1)
                );
                await m.react(
                  msg.client.emoji.downvote.split(":")[2].slice(0, -1)
                );
              });
            } catch (err) {
              continue;
            }
          }
        }
      })
      .catch(async (err) => {
        msg.client.logger.error(err, false);
        await msg.client.errors.custom(msg, 
          msg.channel,
          `Something unexpected happend: ${err.message}`
        );
      });
  }
};
