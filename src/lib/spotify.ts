import kv from "@vercel/kv"
import wretch from "wretch"
import QueryStringAddon from "wretch/addons/queryString"
import { z } from "zod"
import { env } from "~/env.mjs"

export const spotifyOptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string(),
})

export type SpotifyOption = z.infer<typeof spotifyOptionSchema>

const api = (token: string) =>
  wretch("https://api.spotify.com/v1")
    .addon(QueryStringAddon)
    .errorType("json")
    .resolve((res) => res.json())
    .auth(`Bearer ${token}`)
    .content("application/x-www-form-urlencoded")

type AccessTokenResponse = {
  access_token: string
  token_type: string
  expires_in: number
}

type SpotifyItem = {
  id: string
  images: {
    url: string
  }[]
  name: string
}

type SpotifyResponse = {
  items: SpotifyItem[]
}

type ArtistResponse = {
  artists: SpotifyResponse
}

type AlbumResponse = {
  albums: SpotifyResponse
}

type SpotifyToken = {
  token: string
  timestamp: number
}

/**
 * Generates a Spotify token and caches it for an hour.
 * @returns Promise<string>
 */
async function getToken() {
  const now = Date.now()
  const cachedToken = await kv.get<SpotifyToken>("spotifyToken")
  if (!cachedToken || now - cachedToken.timestamp >= 3600 * 1000) {
    const newToken = await generateToken()
    await kv.set("spotifyToken", {
      token: newToken,
      timestamp: now,
    })
    return newToken
  }
  return cachedToken.token
}

/**
 * Generates a new Spotify access token.
 * @returns Promise<string>
 */
async function generateToken() {
  const authorization = `Basic ${Buffer.from(
    `${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`,
  ).toString("base64")}`

  try {
    const response = (await wretch()
      .url("https://accounts.spotify.com/api/token")
      .addon(QueryStringAddon)
      .errorType("json")
      .resolve((res) => res.json())
      .auth(authorization)
      .content("application/x-www-form-urlencoded")
      .query({
        grant_type: "client_credentials",
      })
      .post()) as AccessTokenResponse

    return response.access_token
  } catch (e) {
    throw new Error(`Failed to generate token`)
  }
}

/**
 * Searches on either artists or albums.
 * @param searchTerm string
 * @returns Promise<TResponse>
 */
async function performSearch<TResponse>(
  type: "artist" | "album",
  searchTerm: string,
): Promise<TResponse> {
  const token = await getToken()

  try {
    return (await api(token)
      .url("/search")
      .query({
        q: searchTerm,
        type,
        limit: "5",
      })
      .get()) as TResponse
  } catch (e) {
    throw new Error("Error searching Spotify")
  }
}

/**
 * Searches Spotify for the given artist.
 * @param searchTerm string
 * @returns Promise<SpotifyOption[]>
 */
export async function searchForArtists(searchTerm: string): Promise<SpotifyOption[]> {
  const data = await performSearch<ArtistResponse>("artist", searchTerm)

  try {
    return data.artists.items.map((artist) => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url ?? "",
    }))
  } catch (e) {
    return []
  }
}

/**
 * Searches Spotify for the given album.
 * @param searchTerm string
 * @returns Promise<SpotifyOption[]>
 */
export async function searchForAlbums(searchTerm: string): Promise<SpotifyOption[]> {
  const data = await performSearch<AlbumResponse>("album", searchTerm)

  try {
    return data.albums.items.map((album) => ({
      id: album.id,
      name: album.name,
      imageUrl: album.images[0]?.url ?? "",
    }))
  } catch (e) {
    return []
  }
}

/**
 * Fetches the given artist.
 * @param spotifyId string
 * @returns Promise<SpotifyOption>
 */
export async function fetchArtist(spotifyId: string): Promise<SpotifyOption> {
  const token = await getToken()

  try {
    const data = (await api(token).url(`/artists/${spotifyId}`).get()) as SpotifyItem

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.images[0]?.url ?? "",
    }
  } catch (e) {
    throw new Error("Error fetching artist from Spotify")
  }
}

/**
 * Fetches the given album.
 * @param spotifyId string
 * @returns Promise<SpotifyOption>
 */
export async function fetchAlbum(spotifyId: string): Promise<SpotifyOption> {
  const token = await getToken()

  try {
    const data = (await api(token).url(`/albums/${spotifyId}`).get()) as SpotifyItem

    return {
      id: data.id,
      name: data.name,
      imageUrl: data.images[0]?.url ?? "",
    }
  } catch (e) {
    throw new Error("Error fetching album from Spotify")
  }
}
