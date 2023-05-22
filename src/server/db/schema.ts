import { sql, type InferModel } from "drizzle-orm"
import {
  boolean,
  date,
  index,
  int,
  mysqlEnum,
  mysqlTable,
  serial,
  timestamp,
  varchar,
} from "drizzle-orm/mysql-core"
import { createInsertSchema, createSelectSchema } from "drizzle-zod"
import { z } from "zod"

/*
 * Company
 */
export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  nameEn: varchar("name_en", { length: 50 }).notNull(),
  nameKr: varchar("name_kr", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
})
export type Company = InferModel<typeof companies>
export const createCompanySchema = createInsertSchema(companies)
export type CreateCompanySchema = z.infer<typeof createCompanySchema>
export const updateCompanySchema = createCompanySchema
  .partial()
  .omit({ createdAt: true })
  .required({
    id: true,
  })
export type UpdateCompanySchema = z.infer<typeof updateCompanySchema>
export const deleteCompanySchema = updateCompanySchema.pick({ id: true })
export type DeleteCompanySchema = z.infer<typeof deleteCompanySchema>

/*
 * Artist
 */
export const artists = mysqlTable(
  "artists",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    nameEn: varchar("name_en", { length: 50 }).notNull(),
    nameKr: varchar("name_kr", { length: 50 }).notNull(),
    debut: date("debut").notNull(),
    companyId: int("company_id").notNull(),
    isGroup: boolean("is_group").notNull().default(true),
    image: varchar("image", { length: 255 }).notNull(),
    twitter: varchar("twitter", { length: 255 }).notNull(),
    instagram: varchar("instagram", { length: 255 }).notNull(),
    youtube: varchar("youtube", { length: 255 }).notNull(),
    website: varchar("website", { length: 255 }).notNull(),
    spotifyId: varchar("spotify_id", { length: 32 }),
  },
  (table) => ({
    nameEnIndex: index("artists__name_en__idx").on(table.nameEn),
  }),
)
export type Artist = InferModel<typeof artists>
export const selectArtistSchema = createSelectSchema(artists)
export const createArtistSchema = createInsertSchema(artists)
export type CreateArtistSchema = z.infer<typeof createArtistSchema>
export const updateArtistSchema = createArtistSchema.partial().omit({ createdAt: true }).required({
  id: true,
})
export type UpdateArtistSchema = z.infer<typeof updateArtistSchema>
export const deleteArtistSchema = updateArtistSchema.pick({ id: true })
export type DeleteArtistSchema = z.infer<typeof deleteArtistSchema>

/*
 * Member
 */
export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  nameEn: varchar("name_en", { length: 50 }).notNull(),
  nameKr: varchar("name_kr", { length: 50 }).notNull(),
  stageNameEn: varchar("stage_name_en", { length: 50 }).notNull(),
  stageNameKr: varchar("stage_name_kr", { length: 50 }).notNull(),
  image: varchar("image", { length: 255 }).notNull(),
  instagram: varchar("instagram", { length: 255 }).notNull(),
})
export type Member = InferModel<typeof members>
export const selectMemberSchema = createSelectSchema(members)
export const createMemberSchema = createInsertSchema(members).extend({
  artistId: z.number().positive(),
})
export type CreateMemberSchema = z.infer<typeof createMemberSchema>
export const updateMemberSchema = createMemberSchema.partial().omit({ createdAt: true }).required({
  id: true,
  artistId: true,
})
export type UpdateMemberSchema = z.infer<typeof updateMemberSchema>
export const deleteMemberSchema = updateMemberSchema.pick({ id: true })
export type DeleteMemberSchema = z.infer<typeof deleteMemberSchema>

/*
 * Artist to Member pivot table
 */
export const artistsToMembers = mysqlTable(
  "artist_to_member",
  {
    id: serial("id").primaryKey(),
    memberId: int("member_id").notNull(),
    artistId: int("artist_id").notNull(),
  },
  (table) => ({
    memberArtistIndex: index("artist_to_member__artist_id__member_id__idx").on(
      table.memberId,
      table.artistId,
    ),
  }),
)
export type ArtistToMember = InferModel<typeof artistsToMembers>

/*
 * Album
 */
export const albums = mysqlTable(
  "albums",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    artistId: int("artist_id").notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    region: mysqlEnum("region", ["en", "kr", "jp", "other"]).notNull(),
    releaseDate: date("release_date").notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    spotifyId: varchar("spotify_id", { length: 32 }),
  },
  (table) => ({
    artistIndex: index("albums__artist_id__idx").on(table.artistId),
    nameIndex: index("albums__name__idx").on(table.name),
  }),
)
export type Album = InferModel<typeof albums>
export const selectAlbumSchema = createSelectSchema(albums)
export const createAlbumSchema = createInsertSchema(albums)
export type CreateAlbumSchema = z.infer<typeof createAlbumSchema>
export const updateAlbumSchema = createAlbumSchema.partial().omit({ createdAt: true }).required({
  id: true,
})
export type UpdateAlbumSchema = z.infer<typeof updateAlbumSchema>
export const deleteAlbumSchema = updateAlbumSchema.pick({ id: true })
export type DeleteAlbumSchema = z.infer<typeof deleteAlbumSchema>

/*
 * Album Version
 */
export const albumVersions = mysqlTable(
  "album_versions",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    name: varchar("name", { length: 50 }).notNull(),
    albumId: int("album_id").notNull(),
    image: varchar("image", { length: 255 }).notNull(),
  },
  (table) => ({
    albumIndex: index("album_versions__album_id__idx").on(table.albumId),
  }),
)
export type AlbumVersion = InferModel<typeof albumVersions>
export const selectAlbumVersionSchema = createSelectSchema(albumVersions)
export const createAlbumVersionSchema = createInsertSchema(albumVersions)
export type CreateAlbumVersionSchema = z.infer<typeof createAlbumVersionSchema>
export const updateAlbumVersionSchema = createAlbumVersionSchema
  .partial()
  .omit({ createdAt: true })
  .required({
    id: true,
  })
export type UpdateAlbumVersionSchema = z.infer<typeof updateAlbumVersionSchema>
export const deleteAlbumVersionSchema = updateAlbumVersionSchema.pick({ id: true })
export type DeleteAlbumVersionSchema = z.infer<typeof deleteAlbumVersionSchema>

/*
 * Photocard Set
 */
export const photocardSets = mysqlTable(
  "photocard_sets",
  {
    id: serial("id").primaryKey(),
    createdAt: timestamp("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    updatedAt: timestamp("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
    name: varchar("name", { length: 50 }).notNull(),
    type: mysqlEnum("type", ["album", "pob"]).notNull(),
    image: varchar("image", { length: 255 }).notNull(),
    artistId: int("artist_id").notNull(),
    albumId: int("album_id").notNull(),
  },
  (table) => ({
    artistIndex: index("photocard_sets__artist_id__idx").on(table.artistId),
    albumIndex: index("photocard_sets__album_id__idx").on(table.albumId),
  }),
)
export type PhotocardSet = Prettify<
  InferModel<typeof photocardSets> & {
    albumVersionIds: number[]
  }
>
export const selectPhotocardSetSchema = createSelectSchema(photocardSets)
export const createPhotocardSetSchema = createInsertSchema(photocardSets).extend({
  albumVersionIds: z.array(z.number().positive()),
})
export type CreatePhotocardSetSchema = z.infer<typeof createPhotocardSetSchema>
export const updatePhotocardSetSchema = createPhotocardSetSchema
  .partial()
  .omit({ createdAt: true })
  .required({
    id: true,
  })
export type UpdatePhotocardSetSchema = z.infer<typeof updatePhotocardSetSchema>
export const deletePhotocardSetSchema = updatePhotocardSetSchema.pick({ id: true })
export type DeletePhotocardSetSchema = z.infer<typeof deletePhotocardSetSchema>

/*
 * Photocard Set to Album Version pivot table
 */
export const photocardSetToAlbumVersions = mysqlTable(
  "photocard_set_to_album_version",
  {
    id: serial("id").primaryKey(),
    photocardSetId: int("photocard_set_id").notNull(),
    albumVersionId: int("album_version_id").notNull(),
  },
  (table) => ({
    photocardSetAlbumVersionIndex: index("album_version_id__photocard_set_id__idx").on(
      table.photocardSetId,
      table.albumVersionId,
    ),
  }),
)
export type PhotocardSetToAlbumVersions = InferModel<typeof photocardSetToAlbumVersions>

/*
 * Photocard
 */
export const photocards = mysqlTable("photocards", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: timestamp("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  name: varchar("name", { length: 50 }).notNull(),
  photocardSetId: int("photocard_set_id").notNull(),
  artistId: int("artist_id").notNull(),
  memberId: int("member_id").notNull(),
  image: varchar("image", { length: 255 }).notNull(),
})
export type Photocard = InferModel<typeof photocards>

/*
 * Photocard to Member pivot table
 */
export const photocardsToMembers = mysqlTable(
  "photocard_to_member",
  {
    id: serial("id").primaryKey(),
    photocardId: int("photocard_id").notNull(),
    memberId: int("member_id").notNull(),
  },
  (table) => ({
    photocardIndex: index("photocard_to_member__photocard_id__idx").on(table.photocardId),
    membersIndex: index("photocard_to_member__member_id__idx").on(table.memberId),
    memberPhotocardIndex: index("photocard_to_member__photocard_id__member_id__idx").on(
      table.photocardId,
      table.memberId,
    ),
  }),
)

/*
 * User album version collection
 */
export const collectionAlbumVersions = mysqlTable(
  "collection_album_versions",
  {
    clerkId: varchar("clerk_id", { length: 16 }).notNull().primaryKey(),
    albumVersionId: int("album_version_id").notNull(),
  },
  (table) => ({
    clerkIndex: index("collection_album_versions__clerk_id__idx").on(table.clerkId),
    albumVersionIndex: index("collection_album_versions__album_version_id__idx").on(
      table.albumVersionId,
    ),
    clerkAlbumVersionIndex: index("collection_album_versions__clerk_id__album_version_id__idx").on(
      table.clerkId,
      table.albumVersionId,
    ),
  }),
)

/*
 * User photocard collection
 */
export const collectionPhotocards = mysqlTable(
  "collection_photocards",
  {
    clerkId: varchar("clerk_id", { length: 16 }).notNull().primaryKey(),
    photocardId: int("photocard_id").notNull(),
  },
  (table) => ({
    clerkIndex: index("collection_album_versions__clerk_id__idx").on(table.clerkId),
    photocardIndex: index("collection_album_versions__photocard_id__idx").on(table.photocardId),
    clerkphotocardIndex: index("collection_album_versions__clerk_id__album_version_id__idx").on(
      table.clerkId,
      table.photocardId,
    ),
  }),
)
