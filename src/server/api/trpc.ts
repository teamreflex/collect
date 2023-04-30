import { TRPCError, initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { type Context } from "./context";
import { clerkClient } from "@clerk/nextjs/app-beta";

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

const isAuthed = t.middleware(async ({ ctx, next }) => {
  if (!ctx.auth?.userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

const isAdmin = t.middleware(async ({ ctx, next }) => {
  const user = ctx.auth?.userId ? await clerkClient.users.getUser(ctx.auth?.userId) : null;
  if (!user?.publicMetadata.admin) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "No permission",
    });
  }

  return next({
    ctx: {
      ...ctx,
      auth: ctx.auth,
    },
  });
});

export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const authedProcedure = t.procedure.use(isAuthed);
export const adminProcedure = t.procedure.use(isAdmin);
//TODO: add role/permissions based procedures
