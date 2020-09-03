import { ExecuteResult, Bot, Arg, Command } from "../";
import { promisify } from "util";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import http from "http";
import querystring from "querystring";
import { Message, ImageSize, User, Collection } from "discord.js";
import config from "../../src/config";
import { CommandResult, ImageAPIEndpoint, HTTPStatusCode } from "../types";

const asyncExec = promisify(exec);

export class Util {
  public static config = config;

  /**
   * Capitalise a string or words
   * @param {String} str The string to capitalise
   * @returns {String} The capitalised string
   * @public
   * @static
   */
  public static capitalise(str: string): string {
    return str.length > 0
      ? str
        .split(/ +/gi)
        .map((word: string) => word[0].toUpperCase() + word.slice(1).toLowerCase())
        .join(" ")
      : str;
  }

  /**
   * Load environment variables from a .env.json file
   * @param {String} path The path to the .env.json file
   * @returns {Object} The environment variables
   * @public
   * @static
   */
  public static loadEnv(path: string): Record<string, string> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const env = require(path);
    if (!env) throw new Error("(Util#loadEnv) No environment variables to load");

    return Util.loadObjectToEnv(env);
  }

  /**
   * Load an object into environment variables
   * @param {Object} obj The object to load
   * @public
   * @static
   */
  public static loadObjectToEnv(obj: unknown): Record<string, string> {
    for (const entry of Object.entries(obj)) {
      if (typeof entry[1] === "object") {
        Util.loadObjectToEnv(entry[1]);
      } else {
        process.env[entry[0]] = entry[1].toString();
      }
    }
    return process.env;
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
    const result = await asyncExec(command).catch((err) => (error = err));
    return {
      stdin: result?.stdin,
      stdout: result?.stdout,
      stderr: result?.stderr,
      error,
    };
  }

  /**
   * Get a collection of commands but without sensitive info
   * @param {Bot} client The bot's client
   * @returns {Collection<string, Command>} The collection of commands
   * @public
   * @static
   */
  public static getCleanCommands(client: Bot): Collection<string, Command> {
    const commands = new Collection<string, Command>();
    client.cmd.commands.array().forEach((cmd: Command) => commands.set(cmd.opts.name, cmd));
    commands.forEach((cmd) => {
      delete cmd.client;
      delete cmd.opts.__filename;
    });
    return commands;
  }

  /**
   * Find all files in a certain directory (nested)
   * @param {String} dir The directory to read
   * @param {String} pattern The file type to look for
   * @returns {Array<string>} An array of file paths
   * @public
   * @static
   */
  public static findNested(dir: string, pattern = "js"): Array<string> {
    let results: Array<string> = [];

    fs.readdirSync(dir).forEach((innerDir) => {
      innerDir = path.resolve(dir, innerDir);
      const stat = fs.statSync(innerDir);

      if (stat.isDirectory()) results = results.concat(Util.findNested(innerDir, pattern));

      if (stat.isFile() && innerDir.split(".").pop() === pattern) results.push(innerDir);
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
    maxLength?: number,
    avatarTarget?: boolean
  ): Promise<CommandResult | Message> {
    const text = args.join(" ");
    const color = args.join(" ");
    const avatar = msg.author.displayAvatarURL({ size: avatarSize, format: "png" });
    const target = (await msg.client.getUserOrMember(args.join(" "))) as User;
    if (useTarget && !target) return await msg.send("warn", "No valid user was provided");
    if ((useText && text.length > maxLength) || (useColour && color.length > maxLength))
      return await msg.send(
        "warn",
        `Maximum length exceded! Please keep your text to less than ${maxLength} characters`
      );

    let error = null;

    const res = await Util.getImg(endpoint, {
      text,
      avatar: avatarTarget ? target.displayAvatarURL({ size: avatarSize, format: "png" }) : avatar,
      target: target ? target.displayAvatarURL({ size: avatarSize, format: "png" }) : null,
      color,
    }).catch((err) => (error = JSON.parse(err)));
    if (error) {
      msg.client.logger.error(error.message);
      return await msg.send("warn", `Unexpected error: ${error.message}`);
    }

    await msg.channel.send("", {
      files: [{ name: "Image.png", attachment: res }],
    });
    return { done: true };
  }

  /**
   * Request the image api with certain queries
   * @param {String} endpoint The endpoint to request
   * @param {Record<String, String>} query The queries to request with
   * @returns {Promise<any>} The response from requesting the API
   * @public
   * @static
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static getImg(endpoint: ImageAPIEndpoint, query: Record<string, string>): Promise<any> {
    return new Promise((resolve, reject) => {
      const password = Util.config.imageAPI.password;
      const host = Util.config.imageAPI.host;
      const port = Util.config.imageAPI.port;

      const options: Record<string, Record<string, string>> = {};
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
  public static formatArg(a: Arg): string {
    return `${a.required ? "{" : "<"}${a.name}${a.required ? "}" : ">"}`;
  }

  /**
   * HTTP codes with their status text as well
   */
  public static httpCodes: Record<HTTPStatusCode, string> = {
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
    509: "Bandwidth Limit Exceeded",
    510: "Not Extended",
    511: "Network Authentication Required",
    599: "Network Connect Timeout Error",
  };
}
