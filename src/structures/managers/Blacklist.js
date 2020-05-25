module.exports = class BlacklistManager {
  constructor(options = {}) {
    this.client = options.client;
    this.model = options.model;
    this.channelID = options.channelID;

    this.channel = this.client.channels.cache.get(this.channelID);

    this.client.web.app.get(`/api/${this.client.config.apiVersion}/blacklist`, async (req, res) => {
      const blacklists = await this.model.find();
      res.send({ blacklists }).status(200);
    });
  }

  async add(data = {}) {
    if (!data.id || !data.reason)
      throw new Error(
        "BlacklistManager#add() requires both id and reason paramaters"
      );

    const resolved =
      this.client.guilds.cache.get(data.id) ||
      this.client.users.cache.get(data.id);

    const previousModel = await this.model.findOne({
      id: data.id
    });

    if (previousModel)
      return { message: "That Id is already blacklisted", status: 404 };

    const model = new this.model({
      id: data.id,
      reason: data.reason,
      timestamp: Date.now()
    });

    try {
      await model.save();
      await this.client.loadBlacklists();
    } catch (err) {
      return {
        message: "An unexpected error occured",
        error: err.message,
        stack: err.stack,
        status: 500
      };
    }

    return {
      message: `Added **${
        resolved ? resolved.username || resolved.name : data.id
      }** to the blacklist`,
      status: 200
    };
  }

  async remove(data = {}) {
    if (!data.id || !data.reason)
      throw new Error(
        "BlacklistManager#remove() requires both id and reason paramaters"
      );

    const model = await this.model.findOne({
      id: data.id
    });

    if (model === null)
      return { message: "No database entry found", status: 404 };

    const resolved =
      this.client.guilds.cache.get(data.id) ||
      this.client.users.cache.get(data.id);

    try {
      await model.delete();
      await this.client.loadBlacklists();
    } catch (err) {
      return {
        message: "An unexpected error occured",
        error: err.message,
        stack: err.stack,
        status: 500
      };
    }

    return {
      message: `Removed **${
        resolved ? resolved.username || resolved.name : data.id
      }** from the blacklist`,
      status: 200
    };
  }

  async get(id) {
    if (!id)
      throw new Error("BlacklistManager#get() requires the id paramater");

    const resolved =
      this.client.guilds.cache.get(id) || this.client.users.cache.get(id);

    const model = await this.model.findOne({
      id: id
    });

    if (!model) return { message: "No database entry found", status: 404 };

    return {
      message: `${
        resolved
          ? `**${resolved.username} (User)` || `${resolved.name} (Guild)**`
          : id
      } was blacklisted **${this.client.util
        .moment(model.timestamp)
        .from(Date.now())}** for **${model.reason}**`,
      status: 200
    };
  }
};
