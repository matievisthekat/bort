const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("messageDelete");
  }

  async run(client, msg) {
    const snipe = client.snipeMessages.set(msg.channel.id, msg);
    setTimeout(() => snipe.delete(), 10000);

    const data = await client.models.post.findOne({
      postMessageID: msg.id
    });

    if (data !== null) {
      const profile = await client.models.profile.findOne({
        userID: data.userID
      });

      if (profile !== null) {
        profile.postCount--;
        await profile.save().catch((err) => client.logger.error(err));
      }

      await data.delete();
    }

    const suggestion = await client.models.suggestion.findOne({
      guildID: msg.guild.id,
      messageID: msg.id
    });
    if (suggestion) await suggestion.delete();

    const rr = await client.models.reactionrole.find({
      messageID: msg.id,
      guildID: msg.guild.id
    });
    if(rr && rr.length > 0) await rr.map((d) => d.delete());
  }
};
