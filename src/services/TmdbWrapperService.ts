import configs from "../configs/config";
const apiKey = configs.tmdbApiSecret;
import got from "got";
import { MediaItem } from "../models/MediaItem";
import { ValidationException } from "../exceptions/exceptions";

const tmdbApiUrl = "https://api.themoviedb.org/3";

export class TmdbWrapperService {

  public async getByImdbId(external_id: any): Promise<MediaItem> {
    const findUrl =
      `${tmdbApiUrl}/find/${external_id}?api_key=${apiKey}&language=en-US&external_source=imdb_id`;
    const body: any = await got(findUrl, {
      responseType: "json",
      resolveBodyOnly: true
    });

    const result = body.movie_results[0] || body.tv_results[0];
    let itemToReturn = {} as MediaItem;
    if (body.movie_results[0]?.id) {
      itemToReturn = await this.getByTmdbId(result.id, 'movie');
    } else if (body.tv_results[0]?.id) {
      itemToReturn = await this.getByTmdbId(result.id, 'tv');
    } else {
      throw new ValidationException('Unable to get media information of external Id');
    }
    itemToReturn.imdbId = external_id;
    return itemToReturn;
  }

  public async getByTmdbId(id: any, type: string): Promise<MediaItem> {
    const tmdbByIdUrl = `https://api.themoviedb.org/3/${type}/${id}?&api_key=${apiKey}`;
    const result: any = await got(tmdbByIdUrl, {
      responseType: "json",
      resolveBodyOnly: true
    });

    const playlistItem = {
      title: result.title || result.name,
      year: result.release_date?.substr(0, 4) || result.first_air_date?.substr(0, 4),
      tagline: result.tagline,
      runtime: result.runtime,
      posterPath: result.poster_path,
      backdropPath: result.backdrop_path,
      overview: result.overview,
      tmdbId: id,
      itemType: type
    } as MediaItem;
    return playlistItem;
  }
}
