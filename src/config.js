const emoji = require("./constants/emoji");

module.exports = {
  apiVersion: "v1",
  apiPort: 3001,
  dblWebhookPort: 8000,
  voteReward: `${emoji.coin} 100`,
  voteRewardAmount: 100,
  msgPrefixes: {
    error: `${emoji.dnd} **|**`,
    success: `${emoji.online} **|**`,
    warning: `${emoji.idle} **|**`,
    loading: `${emoji.generating} **|**`
  },
  links: [
    {
      link: "https://github.com/MatievisTheKat/bort",
      name: "GitHub",
      emoji: emoji.github
    },
    {
      link: "https://bort.matievisthekat.dev",
      name: "Website",
      emoji: emoji.brand
    },
    {
      link: "https://discord.gg/t65hRpd",
      name: "Server",
      emoji: emoji.scroll
    }
  ],
  creators: {
    tags: ["MatievisTheKat#4975"],
    ids: ["492708936290402305"]
  },
  defaultUserAvatarURL: "",
  voteLogChannelID: "701147297609941052",
  supportGuildID: "673605613456195584",
  joinLogChannelID: "702972555715281058",
  blacklistChannelID: "",
  staff: {
    ids: ["695287250573066280", "492708936290402305"]
  },
  tags: [
    {
      name: "free hosting",
      content:
        'You may have heard of free hosting services like https://glitch.com and https://heroku.com and thought "Wow, I don\'t have to spend money to keep my bot online??" which is technically true but not ideal.\nFree hosting is not suited to keeping applications online over long periods of time. They are generally not reliable and (some) require some hacky methods to stay online\nIf you are looking to keep your bot (or any application) online you can check out the tag `hosting` for some great, affordable options'
    },
    {
      name: "token leak",
      content:
        'If someone gets hold of your bot\'s token there is no need to panic. Calmly make your way to https://discord.com/developers/applications and click on your bot\'s application. Go to the "Bot" tab and click "Regenerate Token".\nThis will render the leaked token useless and your bot will be safe once again'
    },
    {
      name: "hosting",
      content:
        "*Please note none of these companies asked to be put here. bort has no obligation to any of these companies*\n\n__**Recommended**__\n[`Servercheap.net`](https://servercheap.net/crm/aff.php?aff=365) Starting at $2.99/month for 1GB ram, 30DB SSD, unmetered bandwidth and 1 CPU core\n\n__**More Options**__\n[`Oxide Hosting`](https://oxide.host) Starting at $4.39/month for 2GB ram, 32GB SSD, 1 CPU core, unmetered bandwidth\n[`Vultr`](https://www.vultr.com/) Starting at $2.50/month for 521MD ram, 10GB SSD, 1 CPU core, 0.50TB bandwidth\n[`Digital Ocean`](https://www.digitalocean.com/) Starting at $5/month for 1GB ram, 25GB SSD, 1TB bandwidth, 1 CPU core\n[`OVH`](https://www.ovhcloud.com/) Starting at $6/month for 2GB ram, 40 GB NVMe, unmetered bandwidth, 1 CPU core\n\n__**Bort uses**__\n[`Servercheap.net`](https://servercheap.net/crm/aff.php?aff=365) $3.82/month for 2GB ram, 60GB SSD, unmetered bandwidth, 2 CPU cores, free DNS management"
    }
  ],
  animals: {
    common: [
      {
        name: "cat",
        price: 50
      },
      {
        name: "dog",
        price: 45
      },
      {
        name: "mouse",
        price: 10
      },
      {
        name: "chicken",
        price: 34
      }
    ],
    uncommon: [
      {
        name: "bird",
        price: 76
      },
      {
        name: "eagle",
        price: 100
      }
    ],
    legendary: [
      {
        name: "dinasour",
        price: 400
      },
      {
        name: "electric dog",
        price: 370
      },
      {
        name: "ultra chicken",
        price: 350
      }
    ],
    mythical: [
      {
        name: "ultra dog",
        price: 500
      },
      {
        name: "ultra dinasour",
        price: 670
      },
      {
        name: "ultra eagle",
        price: 780
      }
    ]
  },
  fish: [
    { name: "salmon", price: 10 },
    { name: "cod", price: 15 },
    { name: "catfish", price: 30 },
    { name: "tuna", price: 20 }
  ],
  ores: [
    {
      name: "iron",
      price: 40
    },
    {
      name: "gold",
      price: 60
    },
    {
      name: "coal",
      price: 50
    },
    {
      name: "emerald",
      price: 100
    },
    {
      name: "diamond",
      price: 240
    }
  ]
};
