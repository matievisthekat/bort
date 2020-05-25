const { Collection } = require("discord.js");
const { findNested } = require("../util/util");

module.exports = class CommandManager {
  constructor(options = {}) {
    this.dir = options.directory;
    this.client = options.client;

    this.commands = new Collection();
    this.aliases = new Collection();
    this.commandCooldowns = new Collection();

    this.client.web.app.get(
      `/api/${this.client.config.apiVersion}/commands`,
      (req, res) => {
        const commands = this.commands.array();
        const cooldowns = this.commandCooldowns.array();

        res
          .send({
            prefix: this.client.prefix,
            commands,
            cooldowns
          })
          .status(200);
      }
    );

    this.client.web.app.get(
      `/api/${this.client.config.apiVersion}/commands/search`,
      (req, res) => {
        const query = req.query.query;
        if (!query) return res.sendStatus(404);

        let results = [];

        if (query.split(":")[0] && query.split(":")[1])
          results = this.commands.array().filter((cmd) => {
            let result = false;
            const param = cmd.help[query.split(":")[0]];

            if (typeof param === "string")
              result = param
                .toLowerCase()
                .includes(query.toLowerCase().split(":")[1]);
            else if (Array.isArray(param))
              result = param.includes(query.toLowerCase().split(":")[1]);

            if (result) result = true;
            return result;
          });
        else
          results = this.commands
            .array()
            .filter((cmd) =>
              cmd.help.name.toLowerCase().includes(query.toLowerCase())
            );

        res
          .send({
            prefix: this.client.prefix,
            results
          })
          .status(200);
      }
    );

    this.client.web.app.get(
      `/api/${this.client.config.apiVersion}/command/:name`,
      (req, res) => {
        const name = req.params.name;
        const command =
          this.commands.get(name) || this.commands.get(this.aliases.get(name));

        res.send({ command }).status(200);
      }
    );
  }

  load() {
    this.commands.clear();
    this.aliases.clear();

    this.client.logger.log("Cleared all aliases and commands");

    const files = findNested(this.dir, ".js");
    for (const file of files) {
      const command = new (require(file))();

      if (!command.help || !command.config || !command.run) continue;

      command.path = file;
      this.commands.set(command.help.name, command);
      this.commandCooldowns.set(command.help.name, new Collection());

      if (command.help.aliases && command.help.aliases.length > 0)
        command.help.aliases.map((a) => this.aliases.set(a, command.help.name));
    }

    this.client.logger.log(`Loaded ${this.commands.size} commands`);

    return {
      commands: this.commands,
      message: "Successfully loaded all commands",
      status: 200
    };
  }

  unload(options = {}) {
    if (options.full) {
      this.client.logger.warn("Force full unload");

      this.commands.clear();
      this.aliases.clear();

      const files = findNested(this.dir, ".js");
      for (const file of files) delete require.cache[require.resolve(file)];

      return { message: "Successfully unloaded", status: 200 };
    } else {
      this.client.logger.warn("Force command unload");

      const cmd = this.commands.get(options.cmdName);
      if (cmd) {
        delete require.cache[require.resolve(cmd.path)];

        if (cmd.aliases && cmd.aliases.length > 0)
          cmd.aliases.map((a) => this.aliases.delete(a));
        this.commands.delete(cmd.name);

        return {
          message: `Successfully unloaded ${options.cmdName}`,
          status: 200
        };
      } else return { message: "No command found", status: 404 };
    }
  }

  reloadCommand(cmdName) {
    try {
      this.client.logger.warn("Force command reload");

      const cmd =
        this.commands.get(cmdName) ||
        this.commands.get(this.aliases.get(cmdName));
      if (!cmd) return { message: "No command found", status: 404 };

      const path = cmd.path;

      const files = findNested(this.dir, ".js");
      if (!files.includes(path))
        return { message: "No command file found", status: 404 };

      delete require.cache[require.resolve(cmd.path)];

      if (cmd.aliases && cmd.aliases.length > 0)
        cmd.aliases.map((a) => this.aliases.delete(a));
      this.commands.delete(cmd.name);

      const command = new (require(path))();
      if (!command.help || !command.config || !command.run)
        return { message: "Command is lacking properties", status: 404 };

      command.path = path;
      this.commands.set(command.help.name, command);
      this.commandCooldowns.set(command.help.name, new Collection());

      if (command.help.aliases && command.help.aliases.length > 0)
        command.help.aliases.map((a) => this.aliases.set(a, command.help.name));

      return {
        message: `Successfully reloaded ${command.help.name}`,
        status: 200
      };
    } catch (err) {
      return { status: 500, message: err.message };
    }
  }
};
