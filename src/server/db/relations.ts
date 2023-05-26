import { relations } from "drizzle-orm"

import {
  albumVersions,
  albums,
  artists,
  artistsToMembers,
  collectionAlbumVersions,
  collectionPhotocards,
  companies,
  members,
  photocardSetToAlbumVersions,
  photocardSets,
  photocards,
  photocardsToMembers,
} from "./schema"

export const companyRelations = relations(companies, ({ many }) => ({
  artists: many(artists),
}))

export const artistRelations = relations(artists, ({ one, many }) => ({
  company: one(companies, {
    fields: [artists.companyId],
    references: [companies.id],
  }),
  albums: many(albums),
  members: many(artistsToMembers),
  photocardSets: many(photocardSets),
}))

export const albumRelations = relations(albums, ({ one, many }) => ({
  artist: one(artists, {
    fields: [albums.artistId],
    references: [artists.id],
  }),
  versions: many(albumVersions),
  photocardSets: many(photocardSets),
}))

export const memberRelations = relations(members, ({ many }) => ({
  artists: many(artistsToMembers),
  photocards: many(photocardsToMembers),
}))

export const artistsToMembersRelations = relations(artistsToMembers, ({ one }) => ({
  artist: one(artists, {
    fields: [artistsToMembers.artistId],
    references: [artists.id],
  }),
  member: one(members, {
    fields: [artistsToMembers.memberId],
    references: [members.id],
  }),
}))

export const albumVersionRelations = relations(albumVersions, ({ one, many }) => ({
  album: one(albums, {
    fields: [albumVersions.albumId],
    references: [albums.id],
  }),
  photocardSets: many(photocardSetToAlbumVersions),
}))

export const photocardSetRelations = relations(photocardSets, ({ one, many }) => ({
  artist: one(artists, {
    fields: [photocardSets.artistId],
    references: [artists.id],
  }),
  album: one(albums, {
    fields: [photocardSets.albumId],
    references: [albums.id],
  }),
  versions: many(photocardSetToAlbumVersions),
}))

export const photocardSetToAlbumVersionsRelations = relations(
  photocardSetToAlbumVersions,
  ({ one }) => ({
    photocardSet: one(photocardSets, {
      fields: [photocardSetToAlbumVersions.photocardSetId],
      references: [photocardSets.id],
    }),
    albumVersion: one(albumVersions, {
      fields: [photocardSetToAlbumVersions.albumVersionId],
      references: [albumVersions.id],
    }),
  }),
)

export const photocardRelations = relations(photocards, ({ one, many }) => ({
  photocardSet: one(photocardSets, {
    fields: [photocards.photocardSetId],
    references: [photocardSets.id],
  }),
  artist: one(artists, {
    fields: [photocards.artistId],
    references: [artists.id],
  }),
  members: many(photocardsToMembers),
}))

export const photocardToMemberRelations = relations(photocardsToMembers, ({ one }) => ({
  photocard: one(photocards, {
    fields: [photocardsToMembers.photocardId],
    references: [photocards.id],
  }),
  member: one(members, {
    fields: [photocardsToMembers.memberId],
    references: [members.id],
  }),
}))

export const albumCollectionRelations = relations(collectionAlbumVersions, ({ one }) => ({
  albumVersion: one(albumVersions, {
    fields: [collectionAlbumVersions.albumVersionId],
    references: [albumVersions.id],
  }),
}))

export const photocardCollectionRelations = relations(collectionPhotocards, ({ one }) => ({
  photocard: one(photocards, {
    fields: [collectionPhotocards.photocardId],
    references: [photocards.id],
  }),
}))
