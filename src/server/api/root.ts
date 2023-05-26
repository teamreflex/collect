import { artistsRouter } from "~/server/api/routers/artists"
import { createTRPCRouter } from "~/server/api/trpc"

import { albumVersionsRouter } from "./routers/album-versions"
import { albumsRouter } from "./routers/albums"
import { companiesRouter } from "./routers/companies"
import { exploreRouter } from "./routers/explore"
import { filesRouter } from "./routers/files"
import { membersRouter } from "./routers/members"
import { photocardSetsRouter } from "./routers/photocard-sets"
import { photocardsRouter } from "./routers/photocards"
import { spotifyRouter } from "./routers/spotify"

export const appRouter = createTRPCRouter({
  companies: companiesRouter,
  artists: artistsRouter,
  members: membersRouter,
  albums: albumsRouter,
  albumVersions: albumVersionsRouter,
  photocardSets: photocardSetsRouter,
  photocards: photocardsRouter,
  files: filesRouter,
  spotify: spotifyRouter,
  explore: exploreRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
