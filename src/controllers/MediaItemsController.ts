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

  public async deleteMediaItem(req: Request, res: Response) {
    await _playlistMediaItemService.deleteMediaItem(req.params.mediaItemId);
    res.status(204).send();
  }

  public async attachExternalIdToMediaItem(req: Request, res: Response) {
    await _playlistMediaItemService.attachExternalIdToMediaItem(req.params.mediaItemId, req.body);
    res.status(200).send();
  }
  public async detachExternalIdFromMediaItem(req: Request, res: Response) {
    await _playlistMediaItemService.detachExternalIdFromMediaItem(req.params.mediaItemId, req.body);
    res.status(204).send();
  }


  public async getByExternalId(req: Request, res: Response) {
    const item = await _playlistMediaItemService.getByExternalId(req.params.externalId, req.query['type']);
    res.json(item);
  }


  public async createMediaItemByExternalId(req: Request, res: Response) {
    const item = await _playlistMediaItemService.createMediaByExternalId(req.params.externalId, req.query['type']);
    res.json(item);
  }


}
