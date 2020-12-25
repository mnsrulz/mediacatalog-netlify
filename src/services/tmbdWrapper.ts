import configs from "../configs/config";
const apiKey = configs.tmdbApiSecret;
import got from "got";

const tmdbApiUrl = "https://api.themoviedb.org/3";

export class TmdbWrapperService {
  public async getByTmdbId() {
  }

  public async getByImdbId(external_id: any) {
    const findUrl =
      `${tmdbApiUrl}/find/${external_id}?api_key=${apiKey}&language=en-US&external_source=imdb_id`;
    const body = await got(findUrl, {
      responseType: "json",
      resolveBodyOnly: true
    });
    return body;
  }
}
