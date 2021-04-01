import { NotFoundException } from "../exceptions/exceptions";
import { Playlist } from "../models/PlaylistItem";
import { GenericTransformer } from "../transformers/genericTransformer";
import { PlaylistDataService } from "./DataServices";

export class PlaylistService {
  public async getAll(): Promise<Playlist[]> {
    var playlists: any[] = await PlaylistDataService.find({});
    return playlists && playlists.map((x) =>
      x.toObject({
        transform: GenericTransformer,
      })
    );
  }

  public async getById(id:string): Promise<Playlist | null> {
    var playlist: any = await PlaylistDataService.findById(id);
    if (playlist) {
      return playlist.toObject({
        transform: GenericTransformer,
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
