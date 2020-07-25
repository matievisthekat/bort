import { types } from "../";
import { promisify } from "util";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";

const realExec = promisify(exec);

export class Util {
  /**
   * @param {String} str The string to capitalise
   * @returns {String} The capitalised string
   * @public
   * @static
   */
  public static capitalise(str: string): string {
    return str.split(/ +/gi).map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase()).join(" ");
  }

  /**
   * @param {String} command The command to execute
   * @returns {Promise<types.IExecuteResult>} The result of executing the command
   * @public
   * @static
   */
  public static async execute(command: string): Promise<types.IExecuteResult> {
    let error = null;
    const result = await realExec(command).catch((err) => (error = err));
    return {
      stdin: result?.stdin,
      stdout: result?.stdout,
      stderr: result?.stderr,
      error
    };
  }

  /**
  * @param {String} dir The directory to read
  * @param {String} pattern The file type to look for
  * @returns {Array<string>} An array of file paths
  * @public
  * @static
  */
  public static findNested(dir: string, pattern: string = "js"): Array<string> {
    let results: Array<string> = [];

    fs.readdirSync(dir).forEach((inner_dir) => {
      inner_dir = path.resolve(dir, inner_dir);
      const stat = fs.statSync(inner_dir);

      if (stat.isDirectory())
        results = results.concat(Util.findNested(inner_dir, pattern));

      if (stat.isFile() && inner_dir.split(".").pop() === pattern)
        results.push(inner_dir);
    });

    return results;
  }
}