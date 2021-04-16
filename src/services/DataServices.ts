import { MediaItemSchema, MediaSourceSchema, PlaylistSchema, RemoteUrlUploadRequestSchema } from "../models/ModelSchemas";
import * as mongoose from "mongoose";
import { MediaItem } from "../models/MediaItem";
import { MediaSource } from "../models/MediaSource";
import { RemoteUrlUploadRequest } from "../models/remoteUrlUploadRequest";
import { Playlist } from "../models/PlaylistItem";
export const MediaSourceDataService = mongoose.model<MediaSource>("MediaSourceSchema", MediaSourceSchema);
export const MediaItemDataService = mongoose.model<MediaItem>("MediaItemSchema", MediaItemSchema);
export const RemoteUrlUploadDataService = mongoose.model<RemoteUrlUploadRequest>("RemoteUrlUploadRequestSchema", RemoteUrlUploadRequestSchema);
export const PlaylistDataService = mongoose.model<Playlist>("PlaylistSchema", PlaylistSchema);