const Command = require("../../structures/base/Command");
const axios = require("axios");

module.exports = class Name extends Command {
  constructor() {
    super({
      name: "mcserver",
      aliases: ["minecraft server"],
      category: "Information",
      description: "View stats on a minecraft server",
      usage: "{server_ip}",
      examples: ["mc.matthewis.online", "mc.matievisthekat.dev", "127.0.0.1"],
      cooldown: "6s",
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const res = await axios.get(`https://api.mcsrvstat.us/2/${args.join(" ")}`);
    const data = res.data;
    if (!data || !data.ip)
      return msg.channel.send(
        msg.warning("Couldn't find a server with that IP address!")
      );

    const embed = new msg.client.embed();
    const plugins = data.plugins ? data.plugins.names : [];
    const mods = data.mods ? data.mods.names : [];

    if (data.online) {
      embed.green
        .setAuthor(
          `Server online${data.hostname ? `: ${data.hostname}` : ""}`,
          `https://api.mcsrvstat.us/icon/${args.join(" ")}`
        )
        .setDescription(data.motd.clean)
        .addField(
          "Server",
          `IP: ${data.ip}\nPort: ${data.port}\nRunning: ${
            data.software || "Vanilla"
          }\nVersion: ${data.version}\nHostname: ${
            data.hostname || "None"
          }\nPlayers: ${data.players.online}/${data.players.max}\nMap: ${
            data.map || "None"
          }`
        )
        .addField(
          "Plugins & Mods",
          `Plugins: ${plugins.slice(0, 10).join(", ") || "None"}${
            plugins.length > 10 ? `And ${plugins.length - 10} more...` : ""
          }\nMods: ${mods.slice(0, 10).join(", ") || "None"}${
            mods.length > 10 ? `And ${mods.length - 10} more...` : ""
          }`
        );
    } else {
      embed.red.setAuthor("Server offline");
    }

    msg.channel.send(embed);
  }
};
