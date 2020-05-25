const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("ready", "dbl-webhook");
  }

  async run(client, hook) {
    client.logger.log(
      `Webhook running at http://${hook.hostname}:${hook.port}${hook.path}`
    );

    // client.util.axios
    //   .post(`http://${hook.hostname}:${hook.port}${hook.path}`, {
    //     headers: {
    //       Authorization: process.env.TOP_GG_WEBHOOK_AUTH
    //     }
    //   })
    //   .then(console.log);
  }
};
