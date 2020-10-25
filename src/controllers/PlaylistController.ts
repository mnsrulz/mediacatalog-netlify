import { Request, Response } from "express";
import { PlaylistService } from "../services/playlistService";
const _playlistService = new PlaylistService();
export class PlaylistController {
  //_playlistService: PlaylistService;
  constructor() {
    //this._playlistService = new PlaylistService();
  }
  public async list(req: Request, res: Response) {
    console.log("calling list...");
    const playlists = await _playlistService.getAll();
    // const result: FileNode[] = await mediaService.fetchYearsByMediaType();
    // const output = await DirectoryController.GetRenderData(req.url, result);
    // const output = [{ test: "test123" }, { test: "second playlist" }];
    res.json(playlists);
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
