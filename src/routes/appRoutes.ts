import { Request, Response, NextFunction, IRouter } from "express";
import express from "express";

import { PlaylistController } from "../controllers/PlaylistController";
import {PlaylistMediaItemsController, MediaItemsController} from '../controllers/PlaylistMediaItemsController';

export class ApplicationRoutes {
  // public directoryController = new DirectoryController();
  // public jobController = new JobsController();
  // public mediaStreamingController = new MediaStreamingController();
  // public linkCacheController = new LinkCacheController();
  // public searchController = new SearchController();
  router: IRouter;
  playlistController: PlaylistController;
  playlistMediaItemsController:PlaylistMediaItemsController;
  mediaItemsController:MediaItemsController;
  /**
     *
     */
  constructor() {
    this.router = express.Router();
    this.playlistController = new PlaylistController();
    this.playlistMediaItemsController = new PlaylistMediaItemsController();
    this.mediaItemsController = new MediaItemsController();
    this.router.route("/playlists").get(this.playlistController.list);
    this.router.route("/playlists/:playlistId").get(this.playlistController.get);
    this.router.route("/playlists").post(this.playlistController.create);

    this.router.route('/playlists/:playlistId/items').get(this.playlistMediaItemsController.list);
    this.router.route('/playlists/:playlistId/items').post(this.playlistMediaItemsController.addMediaItemToPlaylist);
    
    
    this.router.route('/items').get(this.mediaItemsController.list);
    this.router.route('/items').post(this.mediaItemsController.createMediaItem);
    this.router.route('/items/:mediaItemId').get(this.mediaItemsController.get);

    
  }

  public getRoutes(): IRouter {
    return this.router;
    // app.route('/playlists/:playlistId/items').post(playlistController.create);

    // app.route('/').get(mw, this.directoryController.getRoot);
    // app.route(['/movie', '/tv']).get(mw, this.directoryController.getYearsOfMovie);
    // app.route('/movie/:year').get(mw, this.directoryController.getMoviesOfYear);
    // app.route('/movie/:year/:medianame')
    //     .head(send405)
    //     .get(mw, this.directoryController.getMovieMediaSources);
    // app.route(['/movie/:year/:medianame/:filename', '/tv/:year/:medianame/:filename'])
    //     .head(this.mediaStreamingController.getMediaContentHead)
    //     .get(this.mediaStreamingController.getMediaContent);

    // app.route('/tv/:year').get(mw, this.directoryController.getTVShowsOfYear);
    // app.route('/tv/:year/:medianame')
    //     .head(send405)
    //     .get(mw, this.directoryController.getTVMediaSources);

    // app.route(['/movie/:year/:medianame/refreshSources', '/tv/:year/:medianame/refreshSources']).post(this.jobController.refreshSources);

    // app.route('/search').get(this.searchController.getIndex);
    // app.route('/api/links').get(this.linkCacheController.getLinks);
    // app.route('/api/links/refresh/:documentId').post(this.linkCacheController.refresh);

    // function send405(req: Request, res: Response, next: NextFunction) {
    //     res.sendStatus(405);
    // }
  }
}
