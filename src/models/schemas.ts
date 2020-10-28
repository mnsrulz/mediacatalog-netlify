import * as mongoose from "mongoose";

const Schema = mongoose.Schema;

export const PlaylistSchema = new Schema({
  ts: Date,
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
}, { collection: "mediaItem" });
