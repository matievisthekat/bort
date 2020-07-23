const fs = require('fs')
const path = require('path')

function findNested (dir, pattern = '.js') {
  let results = []

  fs.readdirSync(dir).forEach((innerDir) => {
    innerDir = path.resolve(dir, innerDir)
    const stat = fs.statSync(innerDir)

    if (stat.isDirectory()) {
      results = results.concat(findNested(innerDir, pattern))
    }

    if (stat.isFile() && innerDir.endsWith(pattern)) {
      results.push(innerDir)
    }
  })

  return results
}

module.exports = findNested
