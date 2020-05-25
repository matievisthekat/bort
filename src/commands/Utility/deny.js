const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "deny",
      aliases: ["decline"],
      category: "Utility",
      description: "Deny a suggestion",
      usage: "{message ID}",
      examples: ["703163522917335122 just no", "700663316091240478"],
      cooldown: "5s",
      requiredPerms: ["MANAGE_MESSAGES"],
      requriedClientPerms: ["MANAGE_MESSAGES"]
    });
  }

  async run(msg, args, flags) {
    const suggestion = await msg.client.models.suggestion.findOne({
      messageID: args[0]
    });
    if (!suggestion)
      return msg.channel.send(msg.warning("No suggestion was found!"));

    const sData = (await msg.client.models.suggestionChannel.findOne({
      guildID: msg.guild.id
    })) || { channelID: msg.channel.id };

    const sChan = await msg.client.resolve(
      "channel",
      sData.channelID,
      msg.guild
    );
    if (!sChan)
      return msg.channel.send(msg.warning("No suggestions channel found!"));

    const m = await sChan.messages.fetch(suggestion.messageID).catch(() => {});
    if (!m)
      return await msg.client.errors.custom(msg, 
        msg.channel,
        "I could not fetch the message from the suggestions channel"
      );

    const preEmbed = m.embeds[0];
    if (!preEmbed) {
      msg.channel.send(msg.warning("No suggestion found"));
      return await m.delete();
    }

    const embed = new msg.client.embed()
      .setColor(msg.client.colours.red)
      .setDescription(preEmbed.description)
      .setAuthor(preEmbed.author.name, preEmbed.author.iconURL)
      .setFooter(`Denied by ${msg.author.tag}`);

    m.edit(`**Denied** ${args.slice(1).join(" ") || "No notes"}`, embed);

    suggestion.accepted = false;
    suggestion.denied = true;

    await suggestion.save();

    msg.channel.send(msg.success(`Denied the suggestion`));
  }
};
