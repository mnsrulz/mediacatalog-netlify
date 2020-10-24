import { Request, Response } from "express";

export class PlaylistController {
  public async list(req: Request, res: Response) {
    console.log('calling list...');
    // const result: FileNode[] = await mediaService.fetchYearsByMediaType();
    // const output = await DirectoryController.GetRenderData(req.url, result);
    const output = [{ test: "test123" },{ test: "second playlist" }];
    res.json(output);
  }

  public async get(req: Request, res: Response) {
    const output = { test: "get test123" };
    res.json(output);
  }

  public async create(req: Request, res: Response) {
    const output = { test: "create test123" };
    res.json(output);
  }  
}
