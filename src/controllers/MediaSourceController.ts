import { Request, Response } from "express";
import { MediaSourceService } from "../services/MediaSourceService";
const _mediaSourceService = new MediaSourceService();

export class MediaSourceController {
  public async list(req: Request, res: Response) {    
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const pageNumber = parseInt(req.query.pageNumber as string) || 1;
    const items = await _mediaSourceService.getItems(pageNumber, pageSize, req.query.q as string)
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
  
}
