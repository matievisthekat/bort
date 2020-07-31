import { types } from "../";
import { promisify } from "util";
import { exec } from "child_process";
import * as fs from "fs";
import * as path from "path";
import { Arg } from "./base/Command";

const realExec = promisify(exec);

export type HTTPStatusCode = 100 | 101 | 102 | 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226 | 300 | 301 | 302 | 303 | 304 | 305 | 307 | 308 | 400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 | 413 | 414 | 415 | 416 | 417 | 418 | 421 | 422 | 423 | 424 | 426 | 428 | 429 | 431 | 444 | 451 | 499 | 500 | 501 | 502 | 503 | 504 | 505 | 506 | 507 | 508 | 509 | 510 | 511 | 599;

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
   * @returns {Promise<types.ExecuteResult>} The result of executing the command
   * @public
   * @static
   */
  public static async execute(command: string): Promise<types.ExecuteResult> {
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