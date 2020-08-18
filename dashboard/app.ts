import express, { Express } from "express";
import { resolve, join } from "path";
import { Bot } from "../lib";
import { EventEmitter } from "events";

export default class Dashboard extends EventEmitter {
  public app: Express;
  public port: number = Number(process.env["website.port"]);

  constructor(private client: Bot) {
    super();

    this.app = express();
  }

  public load() {
    const pub = resolve("./dist/public");
    console.log(pub);

    this.app.use(express.static(pub));

    this.app.listen(this.port, () => this.client.logger.log(`Website listening on port ${this.port}`));
  }
}
