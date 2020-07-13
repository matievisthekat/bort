import * as fs from "fs";
import * as path from "path";

/**
 * findNested
 * @param {String} dir The directory to read
 * @param {String} pattern The file type to look for
 * @returns An array of file paths
 */
export function findNested(dir: string, pattern: string = "js"): Array<string> {
  let results: Array<string> = [];

  fs.readdirSync(dir).forEach((inner_dir) => {
    inner_dir = path.resolve(dir, inner_dir);
    const stat = fs.statSync(inner_dir);

    if (stat.isDirectory())
      results = results.concat(findNested(inner_dir, pattern));

    if (stat.isFile() && inner_dir.split(".").pop() === pattern)
      results.push(inner_dir);
  });

  return results;
}
