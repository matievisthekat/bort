const Command = require("../../structures/base/Command");

module.exports = class Reddit extends Command {
  constructor() {
    super({
      name: "reddit",
      aliases: ["r/"],
      category: "Core",
      description: "Fetch a post from a subreddit",
      usage: "<subreddit>",
      examples: ["memes", "aww"],
      cooldown: "5s",
      requiresArgs: false,
      guildOnly: false
    });
  }

  async run(msg, args, flags) {
    const sr = encodeURIComponent(args.join(" "));
    const m = await msg.channel.send(msg.loading("Fetching posts..."));

    const res = await msg.client.util.axios.get(
      `https://api.reddit.com/r/${sr}?sort=hot`
    );
    if (!res || res.status !== 200)
      return m.edit(
        msg.error("Could not retrieve anything from that subreddit!")
      );

    const post = res.data.data.children
      .filter((d) => (msg.channel.nsfw ? true : !d.data.over_18))
      .random();

    if (!post) return m.edit(msg.warning("No posts found!"));

    const postText = post.data.selftext ? post.data.selftext.substring(0, 2000) : "";
    const diff = post.data.selftext ? post.data.selftext.length - postText.length : 0;
    const diffText = post.data.selftext ? post.data.selftext.substring(
      postText.length,
      post.data.selftext.length
    ) : "";

    const embed = new msg.client.embed()
      .setURL(`https://reddit.com${post.data.permalink}`)
      .setTitle(post.data.title)
      .setDescription(
        `${postText} ${
          diff > 1
            ? `\n**\`[${diffText.split(" ").length}] more words...\`**`
            : ""
        }`
      )
      .setImage(post.data.url)
      .addField(
        "Stats",
        `${msg.client.emoji.upvote} ${post.data.ups} **|** ${msg.client.emoji.downvote} ${post.data.downs} **|** ${msg.client.emoji.messages} ${post.data.num_comments}`
      );

    m.edit(post.data.over_18 ? `**NSFW**` : "", embed);
  }
};
