import { NotFoundException } from "../exceptions/exceptions";
import { Playlist } from "../models/PlaylistItem";
import { GenericTransformer } from "../transformers/genericTransformer";
import { PlaylistDataService } from "./DataServices";

const hdhubPlaylist = { title: 'Hdhub', ts: new Date(2021, 1, 1), id: 'hdhub' } as unknown as Playlist
const extramoviesPlaylist = { title: 'Extramovies', ts: new Date(2021, 1, 1), id: 'extramovies' } as unknown as Playlist
const trendingMoviesPlaylist = { title: 'Trending Movies', ts: new Date(2021, 1, 1), id: 'trendingMovies' } as unknown as Playlist
const trendingTvPlaylist = { title: 'Trending TV Shows', ts: new Date(2021, 1, 1), id: 'trendingTv' } as unknown as Playlist

const systemDefinedPlaylist = [hdhubPlaylist, extramoviesPlaylist, trendingMoviesPlaylist, trendingTvPlaylist]

export class PlaylistService {
  public async getAll(includeSystemDefined = false): Promise<Playlist[]> {
    var playlists: any[] = await PlaylistDataService.find({});
    playlists = playlists.map((x) =>
      x.toObject({
        transform: GenericTransformer,
      })
    );
    return includeSystemDefined ? [...systemDefinedPlaylist, ...playlists] : playlists;
  }

  public async getById(id: string): Promise<Playlist | null> {
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
