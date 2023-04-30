import { artistsRouter } from "~/server/api/routers/artists";
import { createTRPCRouter } from "~/server/api/trpc";
import { companiesRouter } from "./routers/companies";
import { filesRouter } from "./routers/files";
import { membersRouter } from "./routers/members";

export const appRouter = createTRPCRouter({
  companies: companiesRouter,
  artists: artistsRouter,
  members: membersRouter,
  files: filesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
