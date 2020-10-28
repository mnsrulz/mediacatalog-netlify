import * as mongoose from "mongoose";

import { PlaylistSchema } from "../models/schemas";
import { Playlist } from "../models/playlist";

const PlaylistDataService = mongoose.model("PlaylistSchema", PlaylistSchema);

const playlistTransformer = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret["_id"];
  delete ret["__v"];
  return ret;
};


export class PlaylistService {
  public async getAll(): Promise<Playlist[]> {
    var playlists: any[] = await PlaylistDataService.find({});
    return playlists && playlists.map((x) =>
      x.toObject({
        transform: playlistTransformer,
      })
    );
  }

  public async getById(id:String): Promise<Playlist | null> {
    var playlist: any = await PlaylistDataService.findById(id);
    if (playlist) {
      return playlist.toObject({
        transform: playlistTransformer,
      });
    }
    return null;
  }

  public async addPlaylist(item: Playlist): Promise<String> {
    const itemToAdd = {
      title: item.title
    };
    const createdDocument = await PlaylistDataService.create(itemToAdd);
    return createdDocument._id;
  }
}
