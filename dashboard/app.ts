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

    this.app.use(express.static(pub));
    this.app.use("/dash", require("./routes/dash"));

    this.app.set("views", join(__dirname, "views"));
    this.app.set("view engine", "ejs");

    this.app.listen(this.port, () => this.client.logger.log(`Website listening on port ${this.port}`));
  }
}
