const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "reactionrole",
      aliases: ["rr"],
      category: "Utility",
      description: "Setup reaction roles for a message",
      usage: "{message ID} {role} {emoji}",
      examples: ["700663316091240478 :clap: Master"],
      cooldown: "5s",
      requiredPerms: ["MANAGE_ROLES"],
      requriedClientPerms: ["MANAGE_ROLES"]
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.messages.fetch(args[0]).catch(() => {});
    if (!m)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "No message was found! Make sure you are in the same channel as the setup message!"
      );

    const rrs = await msg.client.models.reactionrole.find({ messageID: m.id });
    if (rrs.length > 19 || m.reactions.cache.size > 19)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "There are too many reactions on that message to add another one!"
      );

    const role = await msg.client.resolve("role", args[1], msg.guild);
    if (!role)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "Couldn't find a role!"
      );

    if (!args[2])
      return msg.client.errors.invalidArgs(
        msg,
        msg.guild,
        msg.channel,
        this.help.name
      );

    let emojiName = args[2].split(":")[2] || args[2].split(":")[0];
    if (!emojiName)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "You need to specify a valid emoji!"
      );

    const message = await msg.channel.send(
      msg.loading("Setting up reaction role..")
    );

    if (parseInt(emojiName) > 0) {
      emojiName = emojiName.slice(0, -1);
      await m.react(emojiName);
    } else await m.react(args[2]);

    const rr =
      (await msg.client.models.reactionrole.findOne({
        mesgsaeID: m.id,
        guildID: msg.guild.id
      })) ||
      new msg.client.models.reactionrole({
        guildID: msg.guild.id,
        messageID: m.id,
        channelID: msg.channel.id
      });

    rr.emoji = emojiName;
    rr.roleID = role.id;

    await rr.save();

    message.edit(
      msg.success(`Setup **${role.name}** on \`${m.id}\` as a reaction role`)
    );
  }
};
