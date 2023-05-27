import { placeholder } from "drizzle-orm"

import { db } from "."

export const fetchCompanyWithArtists = db.query.companies
  .findFirst({
    where: (companies, { eq }) => eq(companies.id, placeholder("id")),
    with: {
      artists: true,
    },
  })
  .prepare()

export const fetchArtistWithContent = db.query.artists
  .findFirst({
    where: (artists, { eq }) => eq(artists.id, placeholder("id")),
    with: {
      company: true,
      albums: true,
      members: {
        with: {
          member: true,
        },
      },
    },
  })
  .prepare()

export const fetchAlbumWithContent = db.query.albums
  .findFirst({
    where: (albums, { eq }) => eq(albums.id, placeholder("id")),
    with: {
      artist: true,
      versions: {
        with: {
          photocardSets: true,
        },
      },
      photocardSets: {
        with: {
          versions: true,
        },
      },
    },
  })
  .prepare()

export const fetchPhotocardSet = db.query.photocardSets
  .findFirst({
    where: (photocardSets, { eq }) => eq(photocardSets.id, placeholder("id")),
  })
  .prepare()
