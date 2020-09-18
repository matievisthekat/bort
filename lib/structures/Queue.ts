import { Guild } from "discord.js";
import { Song } from "..";

export class Queue {
  public songs: Song[];

  constructor(public readonly guild: Guild) {}

  public get length(): number {
    return this.songs?.length ?? 0;
  }

  public get duration(): string {
    return "";
  }

  public get nowPlaying(): Song {
    return this.songs[0];
  }

  public addSong(song: Song): void {
    this.songs.push(song);
  }

  public removeSong(prop: string, value: string | Record<string, string>): boolean {
    const song = this.songs.find((s) => s[prop] == value);
    const removed = this.songs.splice(this.songs.indexOf(song), 1);
    if (song && removed && removed[0] && song === removed[0]) return true;
    else return false;
  }
}
