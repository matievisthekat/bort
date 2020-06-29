const express = require("express"),
  cors = require("cors"),
  bodyParser = require("body-parser");

module.exports = class APIManager {
  constructor(client, port) {
    this.port = port;
    this.client = client;

    const app = express();
    this.app = app;
    app.use(cors());
    app.use(bodyParser.json());
    app.use(
      bodyParser.urlencoded({
        extended: true
      })
    );

    // POST request for https://top.gg vote logs
    app.post(`/api/${client.config.api.version}/vote`, async (req, res) => {
      const auth = req.headers.authorization;
      if (auth !== process.env.WEBHOOK_AUTH) return res.sendStatus(403);

      const data = req.body;

      const userID = typeof data.user === "string" ? data.user : data.user.id;
      const botID =
        typeof data.bot === "string" ? data.bot : data.bot.url.split("/").pop();

      const voter = client.users.cache.get(userID);
      const bot = client.users.cache.get(botID);

      await client.emit("vote", voter, bot);

      res.sendStatus(200);
    });

    // GET request for all guilds the client is in
    app.get(`/api/${client.config.api.version}/guilds`, (req, res) =>
      res.send({ guilds: client.guilds.cache.array() }).status(200)
    );

    // GET request for available languages
    app.get(`/api/${client.config.api.version}/languages`, (req, res) => {
      const langs = client.translator.langs;
      res.send({ langs }).status(200);
    });

    // Get request for mutual servers with a specific user
    app.get(
      `/api/${client.config.api.version}/guilds/mutual/:userID`,
      async (req, res) => {
        const userID = req.params.userID;
        let guilds = [];
        for (const guild of client.guilds.cache.array()) {
          const member = await guild.members.fetch(userID).catch(() => {});
          if (
            req.query.manager &&
            member &&
            !member.hasPermission("MANAGE_GUILD")
          )
            continue;
          if (member) guilds.push(guild);
        }

        res.send({ guilds }).status(200);
      }
    );

    // GET request for a specific guild
    app.get(`/api/${client.config.api.version}/guilds/:guildID`, (req, res) => {
      const guildID = req.params.guildID;
      const guild = client.guilds.cache.get(guildID);

      res.send({ guild }).status(200);
    });

    // GET request for all prefixes mapped to their guild
    app.get(`/api/${client.config.api.version}/prefixes`, async (req, res) => {
      const data = await client.models.prefix.find();
      res
        .send({
          prefixes: data.map((doc) => {
            return {
              guildID: doc.guildID,
              prefix: doc.prefix
            };
          })
        })
        .status(200);
    });

    // GET request for the prefix of specific guild
    app.get(
      `/api/${client.config.api.version}/prefix/:guildID`,
      async (req, res) => {
        const data = await client.models.prefix.findOne({
          guildID: req.params.guildID
        });
        res
          .send({
            prefix: data ? data.prefix : client.prefix
          })
          .status(200);
      }
    );

    // POST request to change the prefix of a guild
    app.post(
      `/api/${client.config.api.version}/guilds/:guildID/changeprefix`,
      async (req, res) => {
        const guildID = req.params.guildID;
        const guild = client.guilds.cache.get(guildID);
        if (!guild)
          return res.send({
            error: "That guild was not found!",
            status: 404
          });

        const userID = req.body.body.userID;
        const member = guild.members.cache.get(userID);
        if (!member)
          return res.send({
            error: "You are not a member of that guild!"
          });

        if (
          !member.hasPermission("MANAGE_GUILD") &&
          !this.config.creators.ids.includes(member.user.id)
        )
          return res.send({
            error: "You lack permission to change the prefix for that server"
          });

        const prefix = req.body.body.prefix;
        if (!prefix)
          return res.send({
            error: "You need to send a prefix",
            status: 404
          });

        const data =
          (await this.models.prefix.findOne({
            guildID
          })) ||
          new this.models.prefix({
            guildID
          });

        data.prefix = prefix;
        await data.save();

        res
          .send({
            message: `Successfully changed the prefix to ${data.prefix}`
          })
          .status(200);
      }
    );

    // GET request for roles from a guild
    app.get(
      `/api/${client.config.api.version}/guilds/:guildID/roles`,
      (req, res) => {
        const guildID = req.params.guildID;
        const guild = client.guilds.cache.get(guildID);
        if (!guild)
          return res.send({
            roles: [],
            error: "No guild found with that ID"
          });

        res.send({ roles: guild.roles.cache.array() }).status(200);
      }
    );

    // GET request to see all current blacklists
    app.get(`/api/${client.config.api.version}/blacklist`, async (req, res) => {
      const blacklists = await client.blacklist.model.find();
      res.send({ blacklists }).status(200);
    });

    app.get(`/api/${client.config.api.version}/commands`, (req, res) => {
      const commands = client.cmd.commands.array();
      const cooldowns = client.cmd.commandCooldowns.array();

      res
        .send({
          prefix: client.prefix,
          commands,
          cooldowns
        })
        .status(200);
    });

    app.get(`/api/${client.config.api.version}/commands/search`, (req, res) => {
      const query = req.query.query;
      if (!query) return res.sendStatus(404);

      let results = [];

      if (query.split(":")[0] && query.split(":")[1])
        results = client.cmd.commands.array().filter((cmd) => {
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
        results = client.cmd.commands
          .array()
          .filter((cmd) =>
            cmd.help.name.toLowerCase().includes(query.toLowerCase())
          );

      res
        .send({
          prefix: client.prefix,
          results
        })
        .status(200);
    });

    app.get(`/api/${client.config.api.version}/command/:name`, (req, res) => {
      const name = req.params.name;
      const command =
        client.cmd.commands.get(name) ||
        client.cmd.commands.get(client.cmd.aliases.get(name));

      res.send({ command }).status(200);
    });

    app.get(
      `/api/${client.config.api.version}/currencyUser/:id`,
      async (req, res) => {
        const user = await client.currency.getUser(req.params.id);
        if (user) {
          if (!user.currency.wallet) await user.currency.load();
          res.send(user.currency).status(200);
        } else
          res
            .send({ error: "No user with that ID was found", status: 404 })
            .status(404);
      }
    );

    app.get(`/api/${client.config.api.version}/events`, (req, res) => {
      const events = thisclient.evnt.events.array();
      res.send({ events }).status(200);
    });

    app.post(`/api/${client.config.api.version}/exec`, async (req, res) => {
      if (req.body.AUTH !== client.config.api.AUTH)
        return res.send({ success: false, message: "Unauthorized. Go away" });

      if (!req.body.command || typeof req.body.command !== "string")
        return res.send({
          success: false,
          message: "Please supply a valid command"
        });

      const output = await client
    });
  }

  init() {
    this.app.listen(this.port, () =>
      this.client.logger.log(`API listening on port ${this.port}`)
    );
  }
};
