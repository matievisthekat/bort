const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "unfollow",
      category: "Announcements",
      description: "",
      usage: "",
      examples: [],
      flags: [],
      cooldown: "3s",
      guildOnlyCooldown: false,
      requiresArgs: true,
      requiredPerms: [],
      requriedClientPerms: [],
      guildOnly: true,
      voiceChannelOnly: false,
      currency: false,
      creatorOnly: false
    });
  }

  async run(msg, args, flags) {
    const chanData = await msg.client.models.announcementChannel.findOne({
      channelID: args[0]
    });
    if (!chanData)
      return msg.channel.send(
        new msg.client.embed().error(
          "That channel is not an announcement channel"
        )
      );

    const chan = msg.client.channels.cache.get(chanData.channelID);
    if (!chan) {
      await chanData.delete();
      return msg.channel.send(
        msg.warning(
          `**${chanData.name}** not longer exists. You will have to delete the webhook manually`
        )
      );
    }

    const previousWebhookData = await msg.client.models.announcementWebhook.findOne({
      guildID: msg.guild.id,
      channelID: msg.channel.id,
      followedChannelID: chanData.channelID
    });
    if (!previousWebhookData)
      return msg.channel.send(
        msg.warning(`This channel not following **${chanData.name}**`)
      );

    const webhookData = await msg.client.models.announcementWebhook.findOne({
      guildID: msg.guild.id,
      channelID: msg.channel.id,
      followedChannelID: chanData.channelID
    });

    const webhook = await msg.client.fetchWebhook(
      webhookData.id,
      webhookData.token
    );
    if (webhook) await webhook.delete().catch(() => {});

    await webhookData.delete();

    chanData.subCount--;
    chanData.subs.splice(
      chanData.subs.indexOf({
        token: webhookData.token,
        id: webhookData.id
      }),
      1
    );
    await chanData.save();

    await chan.setTopic(
      `Followers: ${chanData.subCount} | Use \`${await msg.prefix(
        false
      )}follow ${chanData.channelID}\` to follow this channel!`
    );

    msg.channel.send(
      msg.success(`Successfully unfollowed **${chanData.name}**`)
    );
  }
};
