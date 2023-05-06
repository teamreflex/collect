import { artistsRouter } from "~/server/api/routers/artists";
import { createTRPCRouter } from "~/server/api/trpc";
import { companiesRouter } from "./routers/companies";
import { filesRouter } from "./routers/files";
import { membersRouter } from "./routers/members";
import { spotifyRouter } from "./routers/spotify";
import { albumsRouter } from "./routers/albums";

export const appRouter = createTRPCRouter({
  companies: companiesRouter,
  artists: artistsRouter,
  members: membersRouter,
  albums: albumsRouter,
  files: filesRouter,
  spotify: spotifyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
