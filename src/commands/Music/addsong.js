const Command = require("../../structures/base/Command");

module.exports = class extends Command {
  constructor() {
    super({
      name: "addsong",
      category: "Music",
      description: "Add a song to a playlist",
      usage: "{playlist_name} {query | url}",
      examples: ["test going down - tyler joseph"],
      flags: ["list"],
      cooldown: "10s"
    });
  }

  async run(msg, args, flags) {
    const pl = await msg.client.models.playlist.findOne({
      userID: msg.author.id,
      name: args[0]
    });
    if (!pl)
      return msg.channel.send(
        msg.warning("You do not own a playlist with that name!")
      );

    let track = null;
    let failed = null;

    const res = await msg.client.music
      .search(args.join(" "), msg.author)
      .catch((_) => (failed = true));
    if (!res || !res.tracks || !res.tracks[0] || failed)
      return await msg.client.errors.custom(
        msg,
        msg.channel,
        "No results where found! Try again"
      );

    if (flags["list"]) {
      const tracks = res.tracks.slice(0, 9);

      const embed = new msg.client.embed()
        .setDescription(
          tracks.map((t, i) => `**[${i + 1}]** ${t.title}`).join("\n")
        )
        .setFooter("Type 'cancel' to cancel | Times out in 30 seconds");

      msg.channel.send(embed);

      const col = await msg.channel.createMessageCollector(
        (m) => m.author.id === msg.author.id,
        { limit: 30000 }
      );

      col.on("collect", async (m) => {
        if (/cancel|cancle/gi.test(m.content)) return await col.stop();
        if (!/^[0-9]$/.test(m.content))
          return msg.channel.send(msg.warning("Please enter a valid number"));

        const index = parseInt(m.content) - 1;
        const selectedTrack = tracks[index];
        if (!selectedTrack)
          return await msg.client.errors.custom(
            msg,
            msg.channel,
            "Invalid track selection. try again"
          );

        await col.stop();
        track = selectedTrack;

        track.requester.currency = null;
        track.requester.langModel = null;

        pl.tracks.push(track);
        await pl.save().catch((err) => console.log(err.message));

        msg.channel.send(
          msg.success(`Added **${track.title}** to **${pl.name}**`)
        );
      });

      col.on("end", async (collected) => {
        if (!collected.first(2))
          return msg.channel.send(msg.warning("Selection timed out"));
      });
    } else {
      track = res.tracks[0];

      track.requester.currency = null;
      track.requester.langModel = null;

      pl.tracks.push(track);
      await pl.save();

      msg.channel.send(
        msg.success(`Added **${track.title}** to **${pl.name}**`)
      );
    }
  }
};
