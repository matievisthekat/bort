import { SongInfo } from "..";
import { Util } from "./Util";

export class Song {
  public readonly title: string;
  public readonly description: string;
  public readonly publishedAt: Date;
  public readonly channel: string;
  public readonly duration: string;
  public readonly url: string;

  constructor(info: SongInfo) {
    this.title = info.title;
    this.description = info.description;
    this.publishedAt = info.publishedAt;
    this.channel = info.channel;
    this.duration = Util.durationObjectToString(info.duration);
    this.url = info.url;
  }
}
