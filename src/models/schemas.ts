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
  playlistIds: [{
    type: String,
  }],
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
