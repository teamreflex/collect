import { artistsRouter } from "~/server/api/routers/artists";
import { createTRPCRouter } from "~/server/api/trpc";

export const appRouter = createTRPCRouter({
  artists: artistsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
