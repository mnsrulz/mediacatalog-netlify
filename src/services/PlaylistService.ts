import * as mongoose from "mongoose";
import { NotFoundException } from "../exceptions/exceptions";

import { PlaylistSchema } from "../models/ModelSchemas";
import { Playlist } from "../models/PlaylistItem";

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

  public async getById(id:string): Promise<Playlist | null> {
    var playlist: any = await PlaylistDataService.findById(id);
    if (playlist) {
      return playlist.toObject({
        transform: playlistTransformer,
      });
    }
    throw new NotFoundException(id);
  }

  public async addPlaylist(item: Playlist): Promise<String> {
    const itemToAdd = {
      title: item.title
    };
    const createdDocument = await PlaylistDataService.create(itemToAdd);
    return createdDocument._id;
  }
}
