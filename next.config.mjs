/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"))

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  images: {
    unoptimized: true, // disable in prod maybe
    domains: [
      "pub-6796bf577ce54658bcdde8c70188a704.r2.dev",
      "i.scdn.co", // spotify
      "i.imgur.com", // remove in prod
    ],
  },
}
export default config
