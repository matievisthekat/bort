export const pages = [
  {
    name: "Home",
    slug: "home",
    href: "/",
  },
  {
    name: "Commands",
    slug: "commands",
    href: "/commands",
  },
];

const callbackURL = "http://localhost:8000/login/callback";
const scope = ["guilds", "identify"];
export const oauth = {
  url: (clientID: string): string =>
    `https://discord.com/api/oauth2/authorize?redirect_uri=${callbackURL}&client_id=${clientID}&scope=${encodeURIComponent(scope.join(" "))}&response_type=code`,
  callbackURL,
  scope,
};
