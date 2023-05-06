import { z } from "zod";
import { fetchAlbum } from "~/lib/spotify";
import { fetchArtist, searchForAlbums, searchForArtists, spotifyOptionSchema } from "~/lib/spotify";
import {
  createTRPCRouter,
  adminProcedure,
} from "~/server/api/trpc";

export const spotifySearchSchema = z.object({
  type: z.enum(["artist", "album"]),
  searchTerm: z.string().min(1),
});

export const spotifyFetchRecordSchema = z.object({
  type: z.enum(["artist", "album"]),
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

  fetchRecord: adminProcedure
    .input(spotifyFetchRecordSchema)
    .output(spotifyOptionSchema)
    .query(async ({ input }) => {
      return input.type === "artist"
        ? await fetchArtist(input.spotifyId)
        : await fetchAlbum(input.spotifyId);
    }),
});