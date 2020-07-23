const { Schema, model } = require('mongoose')

const AnnouncementChannel = model(
  'guild_channels',
  new Schema({
    guildID: String,
    channelID: String,
    subCount: Number,
    subs: [Object],
    autoAnnounce: Boolean,
    name: String,
    avatarURL: String
  })
)

const AnnouncementChannels = model(
  'all_guild_channels',
  new Schema({
    clientID: String,
    channels: [String]
  })
)

const AnnouncementWebhook = model(
  'wehooks',
  new Schema({
    token: String,
    id: String,
    channelID: String,
    guildID: String,
    followedChannelID: String
  })
)

const Playlist = model(
  'playlists',
  new Schema({
    userID: String,
    name: String,
    tracks: Array
  })
)

module.exports = {
  AnnouncementChannel,
  AnnouncementChannels,
  AnnouncementWebhook,
  Playlist,
  Daily: model('dailies', new Schema({ userID: String })),
  UserLang: model(
    'user_langs',
    new Schema({
      userID: String,
      lang: String
    })
  ),
  Clan: model(
    'clans',
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
  NicknamePrice: model(
    'nicknames_prices',
    new Schema({
      guildID: String,
      price: Number
    })
  ),
  Bank: model(
    'banks',
    new Schema({
      guildID: String,
      amount: Number,
      maxWithdrawAmount: Number,
      allowedRoleID: String,
      blacklistedMemberIDs: Array,
      whitelistedMemberIDs: Array
    })
  ),
  Money: model(
    'money',
    new Schema({
      userID: String,
      wallet: Number,
      bank: Number,
      bankLimit: Number,
      economyXp: Number,
      economyLevel: Number
    })
  ),
  Inv: model(
    'animals',
    new Schema({
      userID: String,
      inv: [Object]
    })
  ),
  Rank: model(
    'ranks',
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
  Blacklist: model(
    'blacklists',
    new Schema({
      id: String,
      reason: String,
      timestamp: String
    })
  ),
  Prefix: model(
    'prefixes',
    new Schema({
      guildID: String,
      prefix: String
    })
  ),
  Post: model(
    'posts',
    new Schema({
      userID: String,
      postMessageID: String,
      upvotes: Number,
      downvotes: Number
    })
  ),
  Profile: model(
    'profiles',
    new Schema({
      userID: String,
      karma: Number,
      postCount: Number
    })
  ),
  PostChannel: model(
    'post_channels',
    new Schema({
      guildID: String,
      public: Boolean,
      channelID: String
    })
  ),
  Afk: model(
    'afks',
    new Schema({
      userID: String,
      reason: String,
      startTime: String
    })
  ),
  SuggestionChannel: model(
    'suggestion_channels',
    new Schema({
      guildID: String,
      channelID: String
    })
  ),
  Suggestion: model(
    'suggestions',
    new Schema({
      guildID: String,
      accepted: Boolean,
      denied: Boolean,
      messageID: String
    })
  ),
  Reactionrole: model(
    'reaction_roles',
    new Schema({
      guildID: String,
      channelID: String,
      messageID: String,
      roleID: String,
      emoji: String
    })
  )
}
