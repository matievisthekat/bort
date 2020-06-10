const Command = require("../../structures/base/Command");

const links = {
  rock: "https://twitch.tv/rock_radio",
  chill: "https://twitch.tv/relaxbeats",
  indie: "https://www.twitch.tv/indiecityradio",
  retro: "https://www.twitch.tv/onlyhitgold",
  urban: "https://www.twitch.tv/urbanorder",
  anime: "https://www.twitch.tv/animeshon_music",
  pop: "https://www.twitch.tv/musiknation",
  lofi: "https://www.twitch.tv/lofiradio"
};
const genres = Object.keys(links);

module.exports = class Genre extends Command {
  constructor() {
    super({
      name: "genre",
      aliases: ["type"],
      category: "Music",
      description: `Play a stream of music from a specific genre of music\nAvailable Genres: [ ${
        genres.join(", ") || "None"
      } ]`,
      usage: "{genre}",
      examples: ["rock", "old", "chill"],
      cooldown: "5s",
      requiresArgs: true,
      voiceChannelOnly: true
    });
  }

  async run(msg, args, flags) {
    const genre = args.join(" ").toLowerCase();
    if (!genres.includes(genre))
      return await msg.client.errors.custom(msg, 
        msg.channel,
        `That is not an available genre! If you think that genre should be added please contact the developer (${msg.client.config.creators.tags[0]})`
      );

    const m = await msg.channel.send(
      msg.loading("Loading. This may take a few seconds...")
    );

    const player =
      (await msg.client.music.players.get(msg.guild)) ||
      (await msg.client.music.players.spawn({
        guild: msg.guild,
        voiceChannel: msg.member.voice.channel,
        textChannel: msg.channel
      }));

    let failed = false;

    const res = await msg.client.music.search(links[genre], msg.author).catch(async (err) => {
        m.edit(msg.warning(`Oops! Looks like we found an error: **${err}**`));
        failed = true;
    });

    if (failed) return;

    if (!res || !res.tracks || !res.tracks[0])
      return m.edit(msg.warning("No music stream was found!"));

    await player.queue.add(res.tracks[0]);
    if (player.queue.size > 1) await player.stop();
    if (!player.playing) await player.play();

    m.edit(
      "",
      new msg.client.embed().success(
        `Loaded the music stream from [here](${links[genre]})! This may take a few seconds to play`
      )
    );
  }
};
