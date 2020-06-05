const Command = require("../../structures/base/Command");
const axios = require("axios");
const fs = require("fs");
const { resolve } = require("path");

const username = "matievisthekat";
const api_key = process.env.PLOTLY_API_KEY;
const plotly = require("plotly")(username, api_key);

module.exports = class extends Command {
  constructor() {
    super({
      name: "corona",
      aliases: ["covid", "covid19", "coronavirus"],
      category: "Information",
      description: "View a graph on coronavirus (global)",
      cooldown: "1m",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const m = await msg.channel.send(msg.loading("Fetching data..."));

    const res = await axios.get("https://covid-193.p.rapidapi.com/history", {
      headers: {
        "x-rapidapi-host": "covid-193.p.rapidapi.com",
        "x-rapidapi-key": process.env.RAPID_API_KEY
      },
      params: {
        country: "all"
      }
    });

    const data = res.data;
    const daysUnfiltered = data.response.map((entry) => entry.day);
    const days = daysUnfiltered.filter(
      (day, index) => daysUnfiltered.indexOf(day) === index
    );

    await m.edit(msg.loading("Formatting data..."));

    const perDayData = [];

    for (const day of days) {
      const dayData = data.response.filter((entry) => entry.day === day);

      const totalCases = dayData.reduce((a, b) => a + b.cases.total, 0);
      const newCases = dayData.reduce((a, b) => a + parseInt(b.cases.new), 0);
      const activeCases = dayData.reduce((a, b) => a + b.cases.active, 0);
      const criticalCases = dayData.reduce((a, b) => a + b.cases.critical, 0);
      const recoveredCases = dayData.reduce((a, b) => a + b.cases.recovered, 0);

      const totalDeaths = dayData.reduce((a, b) => a + b.deaths.total, 0);
      const newDeaths = dayData.reduce((a, b) => a + parseInt(b.deaths.new), 0);

      const totalTests = dayData.reduce((a, b) => a + b.tests.total, 0);
      perDayData.push({
        data: dayData,
        cases: {
          total: totalCases,
          new: newCases,
          active: activeCases,
          critical: criticalCases,
          recovered: recoveredCases
        },
        deaths: {
          total: totalDeaths,
          new: newDeaths
        },
        tests: {
          total: totalTests
        }
      });
    }

    await m.edit(msg.loading("Uploading data..."));

    const graphData = [
      {
        x: days,
        y: perDayData.map((day) => day.cases.active),
        type: "scatter"
      }
    ];
    const figure = { data: graphData };
    const imgOpts = {
      format: "png",
      width: 1000,
      height: 500
    };

    plotly.getImage(figure, imgOpts, async (err, imageStream) => {
      if (err) return console.log(err);

      await m.edit(msg.loading("Downloading image..."));

      const fileStream = fs.createWriteStream(
        `./src/corona-graph.png`
      );
      imageStream.pipe(fileStream);

      await m
        .edit(msg.success("Graph successfully generated. Sending now..."));

      await msg.channel.send({
        files: [resolve(`./src/corona-graph.png`)]
      });
      if (m.deletable) await m.delete();
    });
  }
};
