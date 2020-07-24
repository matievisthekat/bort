import { EventEmitter } from "events";

export class Database extends EventEmitter {
  constructor() {
    super();
  }

  /**
   * load
   * @returns {Promise<any>} The resolved connection
   * @public
   */
  public async load(): Promise<any> {

  }
}
