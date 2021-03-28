import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PlaylistSchema = new Schema({
  ts: {
    type: Date,
    default: Date.now(),
  },
  title: String,
}, { collection: "playlist" });

export const MediaItemSchema = new Schema({
  title: String,
  year: Number,
  itemType: String,
  playlistIds: [{ _id: false, playlistId: String, rank: String }],  //setting _id to false to avoid creation of that in db
  favorite: {
    type: Boolean,
    default: false
  },
  backdropPath: String,
  posterPath: String,
  tagline: String,
  overview: String,
  runtime: String,
  customBackdropPath: String,
  customPosterPath: String,
  imdbId: String,
  tmdbId: String
}, { collection: "mediaItem" });

export const RemoteUrlUploadRequestSchema = new Schema({
  requestId: String,
  fileName: String,
  fileUrl: String,
  ts: {
    type: Date,
    default: Date.now(),
  },
  sequence: Number,
  status: String,
  message: String
}, { collection: "remoteUrlUploadRequest" });

export const CrawlerConfig = new Schema({
  name: String,
  internalType: String
})

export const MediaSourceSchema = new Schema({
  ts: {
    type: Date,
    default: Date.now(),
  },
  externalId: String,
  title: String,
  webViewLink: String,
  created: Date,
  modified: Date,
  slug: String,
  renderedContent: String,
  renderedTitle: String,
  crawlerType: String,
  mediaItemId: String,
  parserInfo: Object
}, { collection: "mediaSource" });