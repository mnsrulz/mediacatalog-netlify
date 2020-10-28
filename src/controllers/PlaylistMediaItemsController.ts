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
}

export class MediaItemsController {
  public async list(req: Request, res: Response) {
    const items = await _playlistMediaItemService.getItems();
    res.json(items);
  }
  public async get(req: Request, res: Response) {
    const item = await _playlistMediaItemService.get(req.params.mediaItemId);
    res.json(item);
  }

  public async createMediaItem(req: Request, res: Response) {
    await _playlistMediaItemService.addMediaItem(req.body);
    res.sendStatus(201);
  }
}
