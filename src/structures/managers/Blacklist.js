module.exports = class BlacklistManager {
  constructor(client) {
    // Set properties
    this.client = client;
    this.channelID = client.config.blacklistChannelID;
    this.model = require("../../constants/models").blacklist;

    // Get the channel to log blacklists in (Not in use)
    this.channel = this.client.channels.cache.get(this.channelID);
  }

  /**
   * Add a blacklist
   * @param {String} [id] The ID to blacklist
   * @param {String} [reason] The reason for blacklisting
   */
  async add(id, reason) {
    if (!id || !reason)
      throw new Error(
        "BlacklistManager#add() requires both id and reason paramaters"
      );

    const resolved =
      this.client.guilds.cache.get(id) || this.client.users.cache.get(id);

    const previousModel = await this.model.findOne({
      id
    });

    if (previousModel)
      return { message: "That Id is already blacklisted", status: 404 };

    const model = new this.model({
      id,
      reason,
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

  /**
   * Remove a blacklist
   * @param {String} [id] The ID to un-blacklist
   * @param {String} [reason] The reason to remove the blacklist
   */
  async remove(id, reason) {
    if (!id || !reason)
      throw new Error(
        "BlacklistManager#remove() requires both id and reason paramaters"
      );

    const model = await this.model.findOne({
      id
    });

    if (model === null)
      return { message: "No database entry found", status: 404 };

    const resolved =
      this.client.guilds.cache.get(id) || this.client.users.cache.get(id);

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
        resolved ? resolved.username || resolved.name : id
      }** from the blacklist`,
      status: 200
    };
  }

  /**
   * Fetch a blacklist
   * @param {String} [id] he ID of the blacklisted user or guild
   */
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
