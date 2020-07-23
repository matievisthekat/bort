const { Schema, model } = require("mongoose");

const announcementChannel = model(
  "guild_channels",
  new Schema({
    guildID: String,
    channelID: String,
    subCount: Number,
    subs: [Object],
    autoAnnounce: Boolean,
    name: String,
    avatarURL: String
  })
);

const announcementChannels = model(
  "all_guild_channels",
  new Schema({
    clientID: String,
    channels: [String]
  })
);

const announcementWebhook = model(
  "wehooks",
  new Schema({
    token: String,
    id: String,
    channelID: String,
    guildID: String,
    followedChannelID: String
  })
);

const playlist = model(
  "playlists",
  new Schema({
    userID: String,
    name: String,
    tracks: Array
  })
);

module.exports = {
  announcementChannel,
  announcementChannels,
  announcementWebhook,
  playlist,
  backups: model(
    "backups",
    new Schema({
      guildID: String,
      data: Object
    })
  ),
  daily: model("dailies", new Schema({ userID: String })),
  userLang: model(
    "user_langs",
    new Schema({
      userID: String,
      lang: String
    })
  ),
  clan: model(
    "clans",
    new Schema({
      name: String,
      leaderID: String,
      bank: Number,
      memberIDs: Array,
      iconURL: String,
      pets: Array,
      health: Number,
      maxHealth: Number,
      wallLevel: Number
    })
  ),
  nicknamePrice: model(
    "nicknames_prices",
    new Schema({
      guildID: String,
      price: Number
    })
  ),
  bank: model(
    "banks",
    new Schema({
      guildID: String,
      amount: Number,
      maxWithdrawAmount: Number,
      allowedRoleID: String,
      blacklistedMemberIDs: Array,
      whitelistedMemberIDs: Array
    })
  ),
  money: model(
    "money",
    new Schema({
      userID: String,
      wallet: Number,
      bank: Number,
      bankLimit: Number,
      economyXp: Number,
      economyLevel: Number
    })
  ),
  inv: model(
    "animals",
    new Schema({
      userID: String,
      inv: [Object]
    })
  ),
  rank: model(
    "ranks",
    new Schema({
      guildID: String,
      roleID: String,
      price: Number,
      description: String,
      timestamp: String,
      lastUpdateTimestamp: String,
      setterID: String
    })
  ),
  blacklist: model(
    "blacklists",
    new Schema({
      id: String,
      reason: String,
      timestamp: String
    })
  ),
  prefix: model(
    "prefixes",
    new Schema({
      guildID: String,
      prefix: String
    })
  ),
  post: model(
    "posts",
    new Schema({
      userID: String,
      postMessageID: String,
      upvotes: Number,
      downvotes: Number
    })
  ),
  profile: model(
    "profiles",
    new Schema({
      userID: String,
      karma: Number,
      postCount: Number
    })
  ),
  postChannel: model(
    "post_channels",
    new Schema({
      guildID: String,
      public: Boolean,
      channelID: String
    })
  ),
  afk: model(
    "afks",
    new Schema({
      userID: String,
      reason: String,
      startTime: String
    })
  ),
  suggestionChannel: model(
    "suggestion_channels",
    new Schema({
      guildID: String,
      channelID: String
    })
  ),
  suggestion: model(
    "suggestions",
    new Schema({
      guildID: String,
      accepted: Boolean,
      denied: Boolean,
      messageID: String
    })
  ),
  reactionrole: model(
    "reaction_roles",
    new Schema({
      guildID: String,
      channelID: String,
      messageID: String,
      roleID: String,
      emoji: String
    })
  )
};
