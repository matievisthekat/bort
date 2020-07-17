import { EventEmitter } from "events";
import * as mongoose from "mongoose";

export class Database extends EventEmitter {
  constructor(private uri: string) {
    super(...arguments);
  }

  /**
   * load
   * @returns {Promise<any>} The resolved connection
   * @public
   */
  public async load(): Promise<any> {
    return await mongoose
      .connect(this.uri, {
        useUnifiedTopology: true,
        useNewUrlParser: true
      })
      .then((connection) => this.emit("ready", connection));
  }
}
