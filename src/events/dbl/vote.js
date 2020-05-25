const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("vote", "dbl-webhook");
  }

  async run(client, vote) {
    console.log(vote);
    if (client.voteLogWebhook) {
      const user = client.users.cache.get(vote.user);
      client.voteLogWebhook.send(
        `${user || "Unknown"} ${
          user ? `**(${user.tag})**` : ""
        } has just voted for <@${client.user.id}>`
      );
    }
  }
};
