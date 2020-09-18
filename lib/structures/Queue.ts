import { Collection } from "discord.js";
import { Guild } from "discord.js";
import ms from "ms";
import { Song } from "..";

export class Queue {
  public songs = new Collection<number, Song>();

  constructor(public readonly guild: Guild) {}

  public get length(): number {
    return this.songs?.size ?? 0;
  }

  public get duration(): string {
    const total = this.songs
      .map((song) => {
        const milliseconds = song.fullDuration
          .split(", ")
          .map(ms)
          .reduce((a, b) => a + b, 0);

        return milliseconds;
      })
      .reduce((a, b) => a + b, 0);
    return ms(total, { long: true });
  }

  public get nowPlaying(): Song | undefined {
    return this.songs[0];
  }

  public addSong(song: Song): Song | undefined {
    const key = this.songs.size + 1;
    this.songs.set(key, song);
    return this.songs.get(key);
  }

  public removeSong(key: number): boolean {
    const exists = this.songs.has(key);
    if (!exists) return false;
    else {
      this.songs.delete(key);
      return true;
    }
  }
}
