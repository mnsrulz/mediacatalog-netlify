import { Request, Response } from "express";
import { PlaylistMediaItemService } from "../services/MediaItemService";
const _playlistMediaItemService = new PlaylistMediaItemService();
export class PlaylistMediaItemsController {
  public async list(req: Request, res: Response) {
    const items = await _playlistMediaItemService.getItems(
      req.params.playlistId,
    );
    res.json(items);
  }

  public async addMediaItemToPlaylist(req: Request, res: Response) {    
    await _playlistMediaItemService.addMediaItemToPlaylist(
      req.params.mediaItemId,
      req.params.playlistId,
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

