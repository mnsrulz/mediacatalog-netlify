import { Request, Response } from "express";
import { PlaylistMediaItemService } from "../services/playlistMediaItemService";
const _playlistMediaItemService = new PlaylistMediaItemService();

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
    const id = await _playlistMediaItemService.addMediaItem(req.body);
    res.status(201).send({ id });
  }
}
