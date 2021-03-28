import { MediaItemSchema, MediaSourceSchema } from "../models/ModelSchemas";
import * as mongoose from "mongoose";
import { MediaItem } from "../models/MediaItem";
import { MediaSource } from "../models/MediaSource";
export const MediaSourceDataService = mongoose.model<MediaSource>("MediaSourceSchema", MediaSourceSchema);
export const MediaItemDataService = mongoose.model<MediaItem>("MediaItemSchema", MediaItemSchema);