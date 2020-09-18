import { Command, Arg, Bot, CommandRunOptions, CommandResult } from "../../../lib";
import { Message } from "discord.js";

export default class Play extends Command {
  constructor(client: Bot) {
    super(client, {
      name: "play",
      description: "Play a song from YouTube",
      category: "Music",
      examples: ["airport terminal - bill wurtz", "https://www.youtube.com/watch?v=dQw4w9Wg"],
      args: [new Arg("query|link", "A search query or link to video/playlist", true)],
      devOnly: false,
      cooldown: "4s",
      __filename,
    });
  }

  /**
   * @param {Message} msg The message that fired this command
   * @param {object} commandArgs The arguments run with every command
   * @param {Command} commandArgs.command The command that was run
   * @param {string>} commandArgs.args The arguments run with the command
   * @param {object} commandArgs.flags The flags run for the command
   * @returns {Promise<CommandResult | Message>} The success status object
   * @public
   */
  public async run(msg: Message, { args }: CommandRunOptions): Promise<CommandResult | Message> {
    const vc = msg.member?.voice.channel;
    if (!vc) return msg.send("warn", "You need to be in a voice channel to use that command");
    if (!vc.joinable) return msg.send("warn", "I cannot join that voice channel");
    if (!vc.speakable) return msg.send("warn", "I cannot speak in that voice channel");

    const query = args.join(" ");
    const songs = await msg.client.songSearch(query, 10);
    const song = await msg.client.selectSong(msg, songs);

    await song.play(vc);

    return { done: true };
  }
}
