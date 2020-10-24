import { Request, Response } from "express";

export class PlaylistController {
  public async list(req: Request, res: Response) {
    // const result: FileNode[] = await mediaService.fetchYearsByMediaType();
    // const output = await DirectoryController.GetRenderData(req.url, result);
    const output = { test: "test123" };
    res.end(output);
  }

  public async get(req: Request, res: Response) {
    const output = { test: "test123" };
    res.end(output);
  }

  public async create(req: Request, res: Response) {
    const output = { test: "test123" };
    res.end(output);
  }  
}
