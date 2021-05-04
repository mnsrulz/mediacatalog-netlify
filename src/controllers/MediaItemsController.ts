import { Request, Response } from "express";
import { PlaylistMediaItemService, MediaItemType } from "../services/MediaItemService";
const _playlistMediaItemService = new PlaylistMediaItemService();

export class MediaItemsController {
  public async list(req: Request, res: Response) {    
    const items = await _playlistMediaItemService.getItems(req.query.type as MediaItemType, req.query.q as string);
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
    await _playlistMediaItemService.attachExternalIdToMediaItem(req.params.mediaItemId, {
      id: req.params.externalId,
      type: req.query['type'] as string,
      tmdbHint: req.query['tmdbHint'] as string
    });
    res.status(200).send();
  }
  public async detachExternalIdFromMediaItem(req: Request, res: Response) {
    await _playlistMediaItemService.detachExternalIdFromMediaItem(req.params.mediaItemId, req.query['type'] as string);
    res.status(204).send();
  }


  public async getByExternalId(req: Request, res: Response) {
    const item = await _playlistMediaItemService.getByExternalId({
      id: req.params.externalId,
      type: req.query['type'] as string,
      tmdbHint: req.query['tmdbHint'] as string
    });
    res.json(item);
  }


  public async createMediaItemByExternalId(req: Request, res: Response) {
    const id = await _playlistMediaItemService.createMediaByExternalId({
      id: req.params.externalId,
      type: req.query['type'] as string,
      tmdbHint: req.query['tmdbHint'] as string
    });
    res.status(201).send({ id });
  }

  public async markItemAsFavorite(req: Request, res: Response) {
    const id = await _playlistMediaItemService.markItemAsFavorite(req.params.mediaItemId);
    res.status(204).send({ id });
  }

  public async unFavoriteItem(req: Request, res: Response) {
    const id = await _playlistMediaItemService.unFavoriteItem(req.params.mediaItemId);
    res.status(204).send({ id });
  }

}
