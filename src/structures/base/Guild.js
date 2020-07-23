const { Structures } = require('discord.js')
const Bank = require('../currency/Bank')

module.exports = Structures.extend(
  'Guild',
  (Guild) =>
    class GuildExtension extends Guild {
      constructor (...args) {
        super(...args)

        // Initialize a bank for this guild
        this.bank = new Bank(this)
      }
    }
)
