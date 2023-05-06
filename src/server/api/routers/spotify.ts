import { z } from "zod";
import { fetchArtist, searchForAlbums, searchForArtists, spotifyOptionSchema } from "~/lib/spotify";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";

export const spotifySearchSchema = z.object({
  type: z.enum(["artist", "album"]),
  searchTerm: z.string().min(1),
});

export const spotifyFetchArtistSchema = z.object({
  spotifyId: z.string().min(1),
});

export const spotifyRouter = createTRPCRouter({
  search: adminProcedure
    .input(spotifySearchSchema)
    .output(z.array(spotifyOptionSchema))
    .query(async ({ input }) => {
      return input.type === "artist"
        ? await searchForArtists(input.searchTerm)
        : await searchForAlbums(input.searchTerm);
    }),

  fetchArtist: adminProcedure
    .input(spotifyFetchArtistSchema)
    .output(spotifyOptionSchema)
    .query(async ({ input }) => {
      return await fetchArtist(input.spotifyId);
    }),
});