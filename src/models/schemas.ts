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
  externalIds: {},
  playlistIds: [{
    type: String,
  }],
  favorite: {
    type: Boolean,
    default: false
  }
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
