import { Request, Response } from "express";
import { PlaylistMediaItemService } from "../services/playlistMediaItemService";
const _playlistMediaItemService = new PlaylistMediaItemService();
export class PlaylistMediaItemsController {
  public async list(req: Request, res: Response) {
    const items = await _playlistMediaItemService.getItems(
      req.params.playlistId,
    );
    res.json(items);
  }

  public async addMediaItemToPlaylist(req: Request, res: Response) {
    const mediaId = req.body.mediaId;
    await _playlistMediaItemService.addMediaItemToPlaylist(
      mediaId,
      req.params.playlistId,
    );
    res.sendStatus(200);
  }
  public async removeMediaItemFromPlaylist(req: Request, res: Response) {
    const mediaId = req.body.mediaId;
    await _playlistMediaItemService.removeMediaItemFromPlaylist(
      mediaId,
      req.params.playlistId,
    );
    res.sendStatus(204);
  }

  public async deleteMediaItemToPlaylist(req: Request, res: Response) {
    const mediaId = req.body.mediaId;
    console.log(req.body);
    await _playlistMediaItemService.removeMediaItemFromPlaylist(
      mediaId,
      req.params.playlistId,
    );
    res.sendStatus(200);
  }
  
}