import {
  boolean,
  date,
  serial,
  text,
  timestamp,
  int,
  mysqlEnum,
  varchar,
} from "drizzle-orm/mysql-core/columns";
import { mysqlTable } from "drizzle-orm/mysql-core/table";

export const companies = mysqlTable("companies", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  nameEn: text("name_en").notNull(),
  nameKr: text("name_kr").notNull(),
});

export const artists = mysqlTable("artists", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  nameEn: text("name_en").notNull(),
  nameKr: text("name_kr").notNull(),
  debut: date("debut").notNull(),
  companyId: int("company_id").notNull(),
  isGroup: boolean("is_group").notNull(),
  image: text("image").notNull(),
  twitter: text("twitter").notNull(),
  instagram: text("instagram").notNull(),
  youtube: text("youtube").notNull(),
  website: text("website").notNull(),
});

export const members = mysqlTable("members", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  nameEn: text("name_en").notNull(),
  nameKr: text("name_kr").notNull(),
  stageNameEn: text("stage_name_en").notNull(),
  stageNameKr: text("stage_name_kr").notNull(),
  image: text("image").notNull(),
});

export const artistsToMembers = mysqlTable('artistsToMembers', {
  memberId: int('member_id').notNull(),
  artistId: int('artist_id').notNull(),
});

export const albums = mysqlTable("albums", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  name: text("name").notNull(),
  region: mysqlEnum('region', ['en', 'kr', 'jp', 'other']).notNull(),
  releaseDate: date("release_date").notNull(),
});

export const albumVersions = mysqlTable("album_versions", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  name: text("name").notNull(),
  albumId: int("album_id").notNull(),
});

export const photocardSets = mysqlTable("photocard_sets", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  name: text("name").notNull(),
  albumVersionId: int("album_version_id").notNull(),
  type: mysqlEnum('type', ['album', 'pob']).notNull(),
});

export const photocards = mysqlTable("photocards", {
  id: serial("id").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow().onUpdateNow(),
  name: text("name").notNull(),
  photocardSetId: int("photocard_set_id").notNull(),
  image: text("image").notNull(),
});

export const photocardsToMembers = mysqlTable('photocardsToMembers', {
  photocardId: int('photocard_id').notNull(),
  memberId: int('member_id').notNull(),
});

export const collectionAlbumVersions = mysqlTable('collection_album_versions', {
  clerkId: varchar('clerkId', { length: 16 }).notNull().primaryKey(),
  albumVersionId: int('album_version_id'),
});

export const collectionPhotocards = mysqlTable('collection_photocards', {
  clerkId: varchar('clerkId', { length: 16 }).notNull().primaryKey(),
  photocardId: int('photocardId'),
});