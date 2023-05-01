export type SiteConfig = {
  name: string;
  description: string;
  url: string;
  links: {
    twitter: string;
    github: string;
  };
  gradient: string;
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
  gradient: "from-rose-100 to-teal-100 dark:from-rose-100/80 dark:to-teal-100/80 text-background",
};
