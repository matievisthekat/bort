const Event = require("../../structures/base/Event");

module.exports = class extends Event {
  constructor() {
    super("guildMemberAdd"
    );
  }

  async run(client, member) {
    if (member.partial) await member.fetch();
    if (member.guild.id !== client.config.supportGuildID) return;

    await member.roles
      .add(["700415188641251408", "700415148380258335"])
      .catch(() => {});
  }
};
