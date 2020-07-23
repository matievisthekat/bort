const emoji = require('../../constants/emoji')
const moment = require('moment')
const chalk = require('chalk')
const ms = require('ms')
const axios = require('axios')

const toProperCase = (str) =>
  str.replace(
    /([^\W_]+[^\s-]*) */g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  )

const chooseString = (str) => str.split(/\|+/gi).random()
const clapString = (str) =>
  `:clap:${str.trim().replace(/ +/gi, ':clap:')}:clap:`
const xpForLevel = (currentLevel) => (currentLevel + 5) * 1000

const xpUntilNextLevel = (currentLevel, currentXp) =>
  (currentLevel + 5) * 1000 - currentXp < 1 ? 1 : currentXp

const formatCategory = (str) =>
  `${emoji[str.toLowerCase()] || ''} ${toProperCase(str)}`

const randomInRange = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const { promisify } = require('util')
const exec = promisify(require('child_process').exec)

async function execute (cmd) {
  let error = null
  const result = await exec(cmd).catch((err) => (error = err))
  return {
    stdin: result.stdin,
    stdout: result.stdout,
    stderr: result.stderr,
    error
  }
}

module.exports = {
  execute,
  toProperCase,
  formatCategory,
  clapString,
  chooseString,
  paginate: require('./paginate'),
  findNested: require('./findNested'),
  wait: require('util').promisify(setTimeout),
  ms,
  randomInRange,
  xpForLevel,
  xpUntilNextLevel,
  chalk,
  moment,
  axios
}
