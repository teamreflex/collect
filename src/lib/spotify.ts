import { z } from "zod";
import { env } from "~/env.mjs";

export const spotifyOptionSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string(),
});

export type SpotifyOption = z.infer<typeof spotifyOptionSchema>

type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
}

type SpotifyItem = {
  id: string;
  images: {
    url: string;
  }[];
  name: string;
}

type SpotifyResponse = {
  items: SpotifyItem[];
}

type ArtistResponse = {
  artists: SpotifyResponse;
}

type AlbumResponse = {
  albums: SpotifyResponse;
}

async function generateToken() {
  console.log('generating spotify token');
  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${env.SPOTIFY_CLIENT_ID}:${env.SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: AccessTokenResponse = await res.json();
  if (res.ok && data.access_token) {
    return data.access_token;
  }

  throw new Error('Failed to generate token');
}

async function performSearch<TResponse>(searchTerm: string): Promise<TResponse> {
  const token = await generateToken();

  const params = new URLSearchParams({
    q: searchTerm,
    type: 'artist',
    limit: '5',
  });

  const res = await fetch(`https://api.spotify.com/v1/search?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: TResponse = await res.json();

  if (res.ok) {
    return data;
  }

  throw new Error("Error searching Spotify");
}

export async function searchForArtists(searchTerm: string): Promise<SpotifyOption[]> {
  const data = await performSearch<ArtistResponse>(searchTerm);

  try {
    return data.artists.items.map(artist => ({
      id: artist.id,
      name: artist.name,
      imageUrl: artist.images[0]?.url ?? '',
    }));
  } catch (e) {
    return [];
  }
}

export async function searchForAlbums(searchTerm: string): Promise<SpotifyOption[]> {
  const data = await performSearch<AlbumResponse>(searchTerm);

  try {
    return data.albums.items.map(album => ({
      id: album.id,
      name: album.name,
      imageUrl: album.images[0]?.url ?? '',
    }));
  } catch (e) {
    return [];
  }
}

export async function fetchArtist(spotifyId: string): Promise<SpotifyOption> {
  const token = await generateToken();

  const res = await fetch(`https://api.spotify.com/v1/artists/${spotifyId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Bearer ${token}`,
    },
  });

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: SpotifyItem = await res.json();

  if (res.ok) {
    return {
      id: data.id,
      name: data.name,
      imageUrl: data.images[0]?.url ?? '',
    };
  }

  throw new Error("Error fetching artist from Spotify");
}