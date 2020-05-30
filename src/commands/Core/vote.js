const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "vote",
      category: "Core",
      description: "Get links to vote for me",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const links = [
      {
        name: "Top.gg (Gives rewards)",
        url: "https://top.gg/bot/681940967615627276/vote"
      },
      {
        name: "Bots for Discord",
        url: "https://botsfordiscord.com/bot/681940967615627276/vote"
      },
      {
        name: "Arcane Center",
        url: "https://arcane-botcenter.xyz/bot/681940967615627276/vote"
      },
      {
        name: "Discord Boats",
        url: "https://discord.boats/bot/681940967615627276/vote"
      },
      {
        name: "Botlist.space",
        url: "https://botlist.space/bot/681940967615627276/upvote"
      },
      {
        name: "Discord Extreme List",
        url: "https://discordextremelist.xyz/bots/681940967615627276"
      },
      {
        name: "Wonder Bot List",
        url: "https://wonderbotlist.com/en/bot/681940967615627276/vote"
      }
    ];
    const embed = new msg.client.embed().none(
      `${links
        .map((link) => `- [${link.name}](${link.url})`)
        .join(
          "\n"
        )}\n\nFind all the links on the Bort website [here](https://bort.matievisthekat.dev/vote)!`
    );

    msg.channel.send(embed);
  }
};
