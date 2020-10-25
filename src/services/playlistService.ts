import * as mongoose from "mongoose";

import { PlaylistSchema } from "../models/schemas";
import { Playlist } from "../models/playlist";

const PlaylistDataService = mongoose.model("MediaCatalog", PlaylistSchema);

export class PlaylistService {
  public async getAll(): Promise<Playlist[]> {
    var playlists: any[] = await PlaylistDataService.find({});
    const result = playlists.map((x) => x as Playlist);
    return result;
  }
}
