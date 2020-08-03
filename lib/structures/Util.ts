import { ExecuteResult, IConfig } from "../";
import { promisify } from "util";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { Arg } from "./base/Command";
import http from "http";
import querystring from "querystring";
import { Message, ImageSize, User } from "discord.js";

const realExec = promisify(exec);

export class Util {
  public static config: IConfig = require("../../../config.json");

  /**
   * Capitalise a string or words
   * @param {String} str The string to capitalise
   * @returns {String} The capitalised string
   * @public
   * @static
   */
  public static capitalise(str: string): string {
    return str.length > 0 ?
      str.split(/ +/gi)
        .map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") : str;
  }

  /**
   * Execute a terminal command
   * @param {String} command The command to execute
   * @returns {Promise<ExecuteResult>} The result of executing the command
   * @public
   * @static
   */
  public static async execute(command: string): Promise<ExecuteResult> {
    let error = null;
    const result = await realExec(command).catch((err) => (error = err));
    return {
      stdin: result?.stdin,
      stdout: result?.stdout,
      stderr: result?.stderr,
      error,
    };
  }

  /**
   * Find all files in a certain directory (nested)
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

  public static async imageCommand(
    endpoint: ImageAPIEndpoint,
    msg: Message,
    args: Array<string>,
    avatarSize?: ImageSize,
    useColour?: boolean,
    useText?: boolean,
    useTarget?: boolean,
    maxLength?: number
  ) {
    const text = args.join(" ");
    const color = args.join(" ");
    const avatar = msg.author.displayAvatarURL({ size: avatarSize, format: "png" });
    const target = await msg.client.resolve("user", args.join(" ")) as User;
    if (useTarget && !target) return await msg.warn("No valid user was provided");
    if ((useText && text.length > maxLength) || (useColour && color.length > maxLength)) return await msg.warn(`Maximum length exceded! Please keep your text to less than ${maxLength} characters`);

    let error = null;

    const res = await Util.getImg(endpoint, {
      text,
      avatar,
      target: target ? target.displayAvatarURL({ size: avatarSize, format: "png" }) : null,
      color
    }).catch(err => error = JSON.parse(err));
    if (error) {
      msg.client.logger.error(error.message);
      return await msg.warn(`Unexpected error: ${error.message}`);
    }

    await msg.channel.send("", {
      files: [
        {
          name: "Image.png",
          attachment: res
        }
      ]
    });
    return { done: true };
  };

  /**
   * Request the image api with certain queries
   * @param {String} endpoint The endpoint to request
   * @param {Record<String, String>} query The queries to request with
   * @returns {Promise<any>} The response from requesting the API
   * @public
   * @static
   */
  public static getImg(endpoint: ImageAPIEndpoint, query: Record<string, string>): Promise<any> {
    return new Promise((resolve, reject) => {
      const password = Util.config.imageAPI.password;
      const host = Util.config.imageAPI.host;
      const port = Util.config.imageAPI.port;

      const options: any = {};
      if (password) options.headers = { Authorization: password };

      const url = new URL(`http://${host}:${port}/${endpoint}?${querystring.stringify(query)}`);
      const req = http.get(url, options);

      req
        .once("response", (res) => {
          const body = [];
          return res
            .on("data", (chunk) => body.push(chunk))
            .once("error", (err) => reject(err))
            .once("end", () => {
              if (res.statusCode !== 200) return reject(body);
              return resolve(Buffer.concat(body));
            });
        })
        .once("error", (err) => reject(err))
        .once("abort", () => reject(new Error("Request Aborted.")));

      return req.end();
    });
  }

  /**
   * Format an argument instance
   * @param {Arg} a The argument instance to format
   */
  public static formatArg(a: Arg) {
    return `${a.required ? "{" : "<"}${a.name}${a.required ? "}" : ">"}`;
  }

  /**
   * HTTP codes with their status text as well
   */
  public static httpCodes: object = {
    // 1×× Informational
    100: "Continue",
    101: "Switching Protocols",
    102: "Processing",
    // 2×× Success
    200: "OK",
    201: "Created",
    202: "Accepted",
    203: "Non - authoritative Information",
    204: "No Content",
    205: "Reset Content",
    206: "Partial Content",
    207: "Multi - Status",
    208: "Already Reported",
    226: "IM Used",
    // 3×× Redirection
    300: "Multiple Choices",
    301: "Moved Permanently",
    302: "Found",
    303: "See Other",
    304: "Not Modified",
    305: "Use Proxy",
    307: "Temporary Redirect",
    308: "Permanent Redirect",
    // 4×× Client Error
    400: "Bad Request",
    401: "Unauthorized",
    402: "Payment Required",
    403: "Forbidden",
    404: "Not Found",
    405: "Method Not Allowed",
    406: "Not Acceptable",
    407: "Proxy Authentication Required",
    408: "Request Timeout",
    409: "Conflict",
    410: "Gone",
    411: "Length Required",
    412: "Precondition Failed",
    413: "Payload Too Large",
    414: "Request - URI Too Long",
    415: "Unsupported Media Type",
    416: "Requested Range Not Satisfiable",
    417: "Expectation Failed",
    418: "I'm a teapot",
    421: "Misdirected Request",
    422: "Unprocessable Entity",
    423: "Locked",
    424: "Failed Dependency",
    426: "Upgrade Required",
    428: "Precondition Required",
    429: "Too Many Requests",
    431: "Request Header Fields Too Large",
    444: "Connection Closed Without Response",
    451: "Unavailable For Legal Reasons",
    499: "Client Closed Request",
    // 5×× Server Error
    500: "Internal Server Error",
    501: "Not Implemented",
    502: "Bad Gateway",
    503: "Service Unavailable",
    504: "Gateway Timeout",
    505: "HTTP Version Not Supported",
    506: "Variant Also Negotiates",
    507: "Insufficient Storage",
    508: "Loop Detected",
    510: "Not Extended",
    511: "Network Authentication Required",
    599: "Network Connect Timeout Error",
  };
}

export type ImageAPIQuery = "avatar" | "color" | "text" | "target";

export type ImageAPIEndpoint =
  | "religion" // Image url: 512x
  | "beautiful" // Image url: 256x
  | "fear" // Image url: 256x
  | "sacred" // Image url: 512x
  | "painting" // Image url: 512x
  | "color" // Name or hex
  | "delete" //  Image url: 256x
  | "garbage" // Image url: 512x
  | "tom" // Image url: 256x
  | "bed" // Image url: 128x | Image url: 128x
  | "crush" // Image url: 512x | Image url: 512x
  | "patrick" // Image url: 512x
  | "respect" // Image url: 128x
  | "dipshit" // Text: 33
  | "picture" // Image url: 256x
  | "tweet" // Text: 165
  | "truth" // Image url: 256x
  | "bobross" // Image url: 512x
  | "mask" // Image url: 512x
  | "father" // Image url: 256x | Text: 42
  | "achievement" // Image url: 64x | Text: 21
  | "dominantColor"; // Image url: any size

export type HTTPStatusCode =
  | 100
  | 101
  | 102
  | 200
  | 201
  | 202
  | 203
  | 204
  | 205
  | 206
  | 207
  | 208
  | 226
  | 300
  | 301
  | 302
  | 303
  | 304
  | 305
  | 307
  | 308
  | 400
  | 401
  | 402
  | 403
  | 404
  | 405
  | 406
  | 407
  | 408
  | 409
  | 410
  | 411
  | 412
  | 413
  | 414
  | 415
  | 416
  | 417
  | 418
  | 421
  | 422
  | 423
  | 424
  | 426
  | 428
  | 429
  | 431
  | 444
  | 451
  | 499
  | 500
  | 501
  | 502
  | 503
  | 504
  | 505
  | 506
  | 507
  | 508
  | 509
  | 510
  | 511
  | 599;
