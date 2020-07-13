import * as fs from "fs";
import * as path from "path";

export function findNested(dir, pattern = "js") {
  let results = [];

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
