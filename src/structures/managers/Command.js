const { Collection } = require('discord.js')
const { findNested } = require('../util/util')

module.exports = class CommandManager {
  constructor (client) {
    this.dir = client.commandDir
    this.client = client

    this.commands = new Collection()
    this.aliases = new Collection()
    this.commandCooldowns = new Collection()
  }

  load () {
    this.commands.clear()
    this.aliases.clear()

    this.client.logger.log('Cleared all aliases and commands')

    const files = findNested(this.dir, '.js')
    for (const file of files) {
      const command = new (require(file))()

      if (!command.help || !command.config || !command.run || command.disabled) { continue }

      command.path = file
      this.commands.set(command.help.name, command)
      this.commandCooldowns.set(command.help.name, new Collection())

      if (command.help.aliases && command.help.aliases.length > 0) { command.help.aliases.map((a) => this.aliases.set(a, command.help.name)) }
    }

    this.client.logger.log(`Loaded ${this.commands.size} commands`)

    return {
      commands: this.commands,
      message: 'Successfully loaded all commands',
      status: 200
    }
  }

  unload (options = {}) {
    if (options.full) {
      this.client.logger.warn('Force full unload')

      this.commands.clear()
      this.aliases.clear()

      const files = findNested(this.dir, '.js')
      for (const file of files) delete require.cache[require.resolve(file)]

      return { message: 'Successfully unloaded', status: 200 }
    } else {
      this.client.logger.warn('Force command unload')

      const cmd = this.commands.get(options.cmdName)
      if (cmd) {
        delete require.cache[require.resolve(cmd.path)]

        if (cmd.aliases && cmd.aliases.length > 0) { cmd.aliases.map((a) => this.aliases.delete(a)) }
        this.commands.delete(cmd.name)

        return {
          message: `Successfully unloaded ${options.cmdName}`,
          status: 200
        }
      } else return { message: 'No command found', status: 404 }
    }
  }

  reloadCommand (cmdName) {
    try {
      this.client.logger.warn('Force command reload')

      const cmd =
        this.commands.get(cmdName) ||
        this.commands.get(this.aliases.get(cmdName))
      if (!cmd) return { message: 'No command found', status: 404 }

      const path = cmd.path

      const files = findNested(this.dir, '.js')
      if (!files.includes(path)) { return { message: 'No command file found', status: 404 } }

      delete require.cache[require.resolve(cmd.path)]

      if (cmd.aliases && cmd.aliases.length > 0) { cmd.aliases.map((a) => this.aliases.delete(a)) }
      this.commands.delete(cmd.name)

      const command = new (require(path))()
      if (!command.help || !command.config || !command.run) { return { message: 'Command is lacking properties', status: 404 } }

      command.path = path
      this.commands.set(command.help.name, command)
      this.commandCooldowns.set(command.help.name, new Collection())

      if (command.help.aliases && command.help.aliases.length > 0) { command.help.aliases.map((a) => this.aliases.set(a, command.help.name)) }

      return {
        message: `Successfully reloaded ${command.help.name}`,
        status: 200
      }
    } catch (err) {
      return { status: 500, message: err.message }
    }
  }
}
