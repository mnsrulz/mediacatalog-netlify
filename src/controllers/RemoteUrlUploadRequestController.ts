import { Request, Response } from "express";
import { RemoteUrlUploadRequestService } from "../services/RemoteUrlUploadRequestService";

const _remoteUrlUploadRequestService = new RemoteUrlUploadRequestService();
export class RemoteUrlUploadRequestController {

  public async list(req: Request, res: Response) {
    const items = await _remoteUrlUploadRequestService.getItems(req.query['status'] as string, req.query['requestId'] as string);
    res.json(items);
  }

  public async create(req: Request, res: Response) {
    const id = await _remoteUrlUploadRequestService.createRequest(req.body);
    res.status(201).send({ id });
  }

  public async getById(req: Request, res: Response) {
    const item = await _remoteUrlUploadRequestService.getById(req.params.remoteUploadRequestId as string);
    res.json(item);
  }

  public async start(req: Request, res: Response) {
    await _remoteUrlUploadRequestService.updateStatus(req.params.remoteUploadRequestId as string, 'running', '');
    res.status(204).send();
  }

  public async error(req: Request, res: Response) {
    await _remoteUrlUploadRequestService.updateStatus(req.params.remoteUploadRequestId as string, 'error', req.body.message);
    res.status(204).send();
  }

  public async progress(req: Request, res: Response) {
    await _remoteUrlUploadRequestService.updateProgress(req.params.remoteUploadRequestId as string, req.body);
    res.status(204).send();
  }

  public async complete(req: Request, res: Response) {
    await _remoteUrlUploadRequestService.updateStatus(req.params.remoteUploadRequestId as string, 'completed', '');
    res.status(204).send();
  }
  public async requeue(req: Request, res: Response) {
    await _remoteUrlUploadRequestService.updateStatus(req.params.remoteUploadRequestId as string, 'queued', '');
    res.status(204).send();
  }
}
