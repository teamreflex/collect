import { authMiddleware } from "@clerk/nextjs";

const publicPaths = ["/", "/sign-in(.*)", "/sign-up(.*)", "/api/trpc(.*)"];

const isPublic = (reqPath: string) => {
  return publicPaths.find((publicPath) =>
    reqPath.match(new RegExp(`^${publicPath}$`.replace("*$", "($|/)")))
  );
};

export default authMiddleware({
  publicRoutes(req) {
    return isPublic(req.nextUrl.pathname) !== undefined;
  },
});

// Stop Middleware running on static files and public folder
export const config = {
  matcher: "/((?!_next/image|_next/static|favicon.ico|site.webmanifest).*)",
};
