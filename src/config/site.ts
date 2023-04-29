export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
};

export const siteConfig: SiteConfig = {
  name: "Collect",
  description:
    "Track your kpop collection",
  url: "http://localhost:3000/",
  links: {
    twitter: "https://twitter.com/Reflexgg",
    github:
      "https://github.com/teamreflex/collect",
  },
};
