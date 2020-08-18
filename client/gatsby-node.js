/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
const fs = require("fs/promises");
const path = require("path");

exports.onPostBuild = async function () {
  console.log(path.join(__dirname, "../dist"), path.join(__dirname, "../dist/public"));
  await createDirIfNotFound(path.join(__dirname, "../dist"));
  await createDirIfNotFound(path.join(__dirname, "../dist/public"));

  await fs.rename(path.join(__dirname, "public"), path.join(__dirname, "../dist/public"));
};

async function createDirIfNotFound(dir) {
  await fs.access(dir).catch(async (err) => await fs.mkdir(dir));
}
