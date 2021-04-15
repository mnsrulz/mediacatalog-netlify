import { Request, Response } from "express";
import { PlaylistMediaItemService } from "../services/MediaItemService";
const _playlistMediaItemService = new PlaylistMediaItemService();
export class PlaylistMediaItemsController {
  public async list(req: Request, res: Response) {
    const items = await _playlistMediaItemService.getPlaylistItems(
      req.params.playlistId,
    );
    res.json(items);
  }
  
  public async listExtraMoviesItems(req: Request, res: Response) {
    const items = await _playlistMediaItemService.getSpecializedCrawlerTypeItems('extramovies', parseInt(req.query.pageSize as string || '50'));
    res.json(items);
  }
  
  public async listHdhubItems(req: Request, res: Response) {
    const items = await _playlistMediaItemService.getSpecializedCrawlerTypeItems('hdhub', parseInt(req.query.pageSize as string || '50'));
    res.json(items);
  }
  
  public async listTrendingMovies(req: Request, res: Response) {    
    const items = await _playlistMediaItemService.listTmdbTrending("movie");    
    res.json(items);
  }

  public async listTrendingTv(req: Request, res: Response) {    
    const items = await _playlistMediaItemService.listTmdbTrending("tv");    
    res.json(items);
  }

  public async addMediaItemToPlaylist(req: Request, res: Response) {    
    await _playlistMediaItemService.addMediaItemToPlaylist(
      req.params.mediaItemId,
      req.params.playlistId      
    );
    res.sendStatus(200);
  }
  public async removeMediaItemFromPlaylist(req: Request, res: Response) {    
    await _playlistMediaItemService.removeMediaItemFromPlaylist(
      req.params.mediaItemId,
      req.params.playlistId,
    );
    res.sendStatus(204);
  }  
}

