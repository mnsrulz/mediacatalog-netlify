import { Request, Response } from "express";
import { RemoteUrlUploadRequestService } from "../services/RemoteUrlUploadRequestService";

const _remoteUrlUploadRequestService = new RemoteUrlUploadRequestService();
export class RemoteUrlUploadRequestController {

  public async list(req: Request, res: Response) {
    const items = await _remoteUrlUploadRequestService.getItems(req.query['status'] as string);
    res.json(items);
  }

  public async create(req: Request, res: Response) {
    const id = await _remoteUrlUploadRequestService.createRequest(req.body);
    res.status(201).send({ id });
  }
}
