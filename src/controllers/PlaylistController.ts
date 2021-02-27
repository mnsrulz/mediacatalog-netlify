import { Request, Response } from "express";
import { PlaylistService } from "../services/PlaylistService";
const _playlistService = new PlaylistService();
export class PlaylistController {
  //_playlistService: PlaylistService;
  constructor() {
    //this._playlistService = new PlaylistService();
  }
  public async list(req: Request, res: Response) {
    const playlists = await _playlistService.getAll();
    res.json(playlists);
  }

  public async get(req: Request, res: Response) {
    const playlistId = req.params.playlistId;
    const playlist = await _playlistService.getById(playlistId);
    res.json(playlist);
  }

  public async create(req: Request, res: Response) {
    const id = await _playlistService.addPlaylist(req.body);
    res.status(201).send({ id });
  }
}
