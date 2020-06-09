const ms = require("ms");

async function paginate(
  msg,
  pages,
  endEmoji = "🗑️",
  emojiList = ["⏪", "⏩"],
  timeout = 120000
) {
  let page = 0;
  const curPage = await msg.channel.send(
    pages[page].setFooter(
      `Page ${page + 1} / ${pages.length} (This times out in (${ms(timeout, {
        long: true
      })})`
    )
  );

  await curPage.react(emojiList[0]);
  await curPage.react(endEmoji);
  await curPage.react(emojiList[1]);

  const reactionCollector = curPage.createReactionCollector(
    (reaction, user) =>
      (emojiList.includes(reaction.emoji.name) ||
        reaction.emoji.name === endEmoji) &&
      !user.bot,
    { time: timeout }
  );

  reactionCollector.on("collect", (reaction) => {
    reaction.users.remove(msg.author);
    switch (reaction.emoji.name) {
      case emojiList[0]:
        page = page > 0 ? --page : pages.length - 1;
        break;
      case emojiList[1]:
        page = page + 1 < pages.length ? ++page : 0;
        break;
      case endEmoji:
        reactionCollector.stop();
        break;
      default:
        break;
    }

    curPage.edit(
      pages[page].setFooter(
        `Page ${page + 1} / ${pages.length} (This times out in ${ms(timeout, {
          long: true
        })})`
      )
    );
  });

  reactionCollector.on("end", async () => {
    await curPage.reactions.removeAll().catch(() => {});
    if (curPage.embeds[0])
      curPage.edit(curPage.embeds[0].setFooter("Timed out")).catch(() => {});
  });
  return curPage;
}

module.exports = paginate;
