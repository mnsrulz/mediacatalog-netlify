import { Request, Response } from "express";
import { MediaSourceService } from "../services/MediaSourceService";
const _mediaSourceService = new MediaSourceService();

export class MediaSourceController {
  public async get(req: Request, res: Response) {
    const item = await _mediaSourceService.getById(req.params.mediaSourceId);
    res.json(item);
  }

  public async list(req: Request, res: Response) {
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const onlyPendingMediaAssignment = (req.query.onlyPendingMediaAssignment as string)?.toLowerCase() === 'true';
    const items = await _mediaSourceService.getItems(pageNumber, pageSize, req.query.q as string, onlyPendingMediaAssignment, req.query.parsedTitle as string)
    res.json(items);
  }

  public async attachMediaItem(req: Request, res: Response) {
    await _mediaSourceService.attachMediaItem(req.params.mediaSourceId, req.params.mediaItemId);
    res.status(200).send();
  }

  public async detachMediaItem(req: Request, res: Response) {
    await _mediaSourceService.detachMediaItem(req.params.mediaSourceId, req.params.mediaItemId);
    res.status(200).send();
  }

  public async attachByExternalId(req: Request, res: Response) {
    await _mediaSourceService.attachByExternalId(req.params.mediaSourceId, {
      id: req.params.externalId,
      type: req.query['type'] as string,      
      tmdbHint: req.query['tmdbHint'] as string
    });
    res.status(200).send();
  }

}
