import { artistsRouter } from "~/server/api/routers/artists";
import { createTRPCRouter } from "~/server/api/trpc";
import { companiesRouter } from "./routers/companies";

export const appRouter = createTRPCRouter({
  artists: artistsRouter,
  companies: companiesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
