import * as mongoose from "mongoose";

import { MediaItemSchema } from "../models/schemas";
import { PlaylistItem } from "../models/playlist";

const MediaItemDataService = mongoose.model("MediaItemSchema", MediaItemSchema);
const playlistItemTransformer = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret["_id"];
  delete ret["__v"];
  return ret;
};
export class PlaylistMediaItemService {
  public async get(mediaItemId: any) {
    var playlist = await MediaItemDataService.findById(mediaItemId);
    if (playlist) {
      return playlist.toObject({
        transform: playlistItemTransformer,
      });
    }
    return null;
  }
  public async getItems(playlistId?: String): Promise<PlaylistItem[]> {
    const query: any = {};
    playlistId && (query["playlistIds"] = playlistId);
    var playlists = await MediaItemDataService.find(query);
    return playlists && playlists.map((x) =>
      x.toObject({
        transform: playlistItemTransformer,
      })
    );
  }

  public async addMediaItem(item: PlaylistItem): Promise<String> {
    const itemToAdd = {
      title: item.title,
      year: item.year,
      itemType: item.itemType,
    };
    console.log("adding this item... ", itemToAdd);
    const createdDocument = await MediaItemDataService.create(itemToAdd);
    return createdDocument._id;
  }

  public async addMediaItemToPlaylist(
    mediaId: any,
    playlistId: any,
  ): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);
    if (doc) {
      if (doc.playlistIds.includes(playlistId)) {
        console.log("Item already exists in the playlist");
      } else {
        console.log("media to modify...", doc);      
        await MediaItemDataService.updateOne({ _id: doc._id }, {
          $push: {
            playlistIds: playlistId,
          },
        });
      }
    } else {
      console.log("document not found...");
    }
  }
}
