import { StreamDispatcher, VoiceConnection } from "discord.js";
import { SongInfo } from "..";
import ytdl from "ytdl-core";
import ms from "ms";

export class Song {
  public readonly title: string;
  public readonly description: string;
  public readonly publishedAt: Date;
  public readonly channel: string;
  public readonly duration: number;
  public readonly url: string;

  // public queue: Queue;
  public dispatcher: StreamDispatcher;
  public connection: VoiceConnection;

  constructor(info: SongInfo /*, queue: Queue*/) {
    this.title = info.title;
    this.description = info.description;
    this.publishedAt = info.publishedAt;
    this.channel = info.channel;
    this.duration = info.duration;
    this.url = info.url;

    // this.queue = queue;
  }

  public get fullDuration(): string {
    return ms(this.duration, { long: true });
  }

  public play(connection: VoiceConnection): StreamDispatcher {
    const dispatcher = connection.play(ytdl(this.url));

    dispatcher.on("close", () => {
      this.dispatcher = null;
    });

    connection.on("disconnect", () => {
      this.connection = null;
    });

    this.dispatcher = dispatcher;
    this.connection = connection;
    return this.dispatcher;
  }

  public pause(): StreamDispatcher {
    if (!this.dispatcher || !this.connection) return null;

    this.dispatcher.pause(true);
    return this.dispatcher;
  }

  public resume(): StreamDispatcher {
    if (!this.dispatcher || !this.connection) return null;

    this.dispatcher.resume();
    return this.dispatcher;
  }

  public stop(): boolean {
    if (!this.dispatcher || !this.connection) return false;

    this.dispatcher.end();
    return true;
  }

  // returns progress as a percentage
  get progress(): number {
    if (!this.dispatcher) return null;

    const streamedTime = this.dispatcher.streamTime;
    const totalTime = this.duration;
    const currentTime = totalTime - streamedTime;
    const percentage = (currentTime / totalTime) * 100;

    return percentage;
  }
}
