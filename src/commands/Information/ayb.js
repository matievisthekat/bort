const Command = require("../../structures/base/Command");
const emoji = require("../../constants/emoji");

module.exports = class Name extends Command {
  constructor() {
    super({
      name: "ayb",
      aliases: ["advertiseyourbot"],
      category: "Information",
      description: "View bort's AYB profile",
      cooldown: "5s",
      requiresArgs: false,
      disabled: true
    });
  }

  async run(msg, args, flags) {
    const me = await msg.client.ayb.fetchBot(msg.client.user.id);
    if (!me.success && me.note)
      return msg.channel.send(
        msg.warning(`Couldn't fetch the AYB api: ${me.note}`)
      );

    const embed = new msg.client.embed()
      .setAuthor(me.username, me.avatarURL)
      .setDescription(`**${me.description.brief}**\n\n${me.description.full}`)
      .addField(
        "Stats",
        `**Votes:** ${me.votes}\n**Premium:** ${
          me.premium ? emoji.check : emoji.x_
        }\n**Certified:** ${
          me.certified ? emoji.check : emoji.x_
        }\n**Approved:** ${me.approved ? emoji.check : emoji.x_}`
      );

    msg.channel.send(embed);
  }
};
