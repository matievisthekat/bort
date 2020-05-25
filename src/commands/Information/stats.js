const Command = require("../../structures/base/Command"),
  { version } = require("discord.js"),
  { cpu, mem, osCmd } = require("node-os-utils"),
  { check } = require("diskusage");

module.exports = class extends Command {
  constructor() {
    super({
      name: "stats",
      aliases: ["statistics"],
      category: "Information",
      description: "View statistics for the bot",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Fetching statistics..."));

    const path = process.platform === "win32" ? "c:" : "/";

    const botUptime = msg.client.util.ms(msg.client.uptime, { long: true });
    const procUptime = msg.client.util.ms(
      msg.client.util.ms(`${process.uptime().toString().split(".")[0]}s`),
      { long: true }
    );
    const nodeV = process.version;
    const djsV = version;
    const plat = msg.client.util.toProperCase(
      `${process.platform} ${process.arch}`
    );
    const cpuUsagePercent = await cpu.usage();
    const amtCPUs = cpu.count();

    const memory = await mem.info();
    const user = await osCmd.whoami();

    check(path, (err, res) => {
      const free = Math.round(res.free / 1000 / 1024 / 1000);
      const used = Math.round((res.total - res.free) / 1000 / 1024 / 1000);
      const tot = Math.round(res.total / 1000 / 1024 / 1000);

      const embed = new msg.client.embed()
        .addField("Versions", `**Node JS:** ${nodeV}\n**Discord.js:** ${djsV}`)
        .addField("Uptime", `**Bot:** ${botUptime}\n**Process:** ${procUptime}`)
        .addField(
          "Memory & CPU",
          `**Total Memory:** ${Math.round(
            memory.totalMemMb
          )} MB\n**Used:** ${Math.round(
            memory.totalMemMb - memory.freeMemMb
          )} MB (${Math.round(
            100 - memory.freeMemPercentage
          )}%)\n**Free Memory:** ${Math.round(
            memory.freeMemMb
          )} MB (${Math.round(
            memory.freeMemPercentage
          )}%)\n**CPU Amount:** ${amtCPUs}\n**CPU Usage:** ${Math.round(
            cpuUsagePercent
          )}%`
        )
        .addField("Host", `**Platform:** ${plat}\n**User:** ${user}`)
        .addField(
          "Disk",
          `**Total:** ${tot} GB\n**Used:** ${used} GB (${Math.round(
            (used / tot) * 100
          )}%)\n**Free:** ${free} GB (${Math.round((free / tot) * 100)}%)`
        );

      m.edit("", embed);
    });
  }
};
