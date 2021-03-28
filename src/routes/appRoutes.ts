import { Request, Response, NextFunction, IRouter } from "express";
import express from "express";

import { PlaylistController } from "../controllers/PlaylistController";
import { PlaylistMediaItemsController } from "../controllers/PlaylistMediaItemsController";
import { MediaItemsController } from "../controllers/MediaItemsController";
import { RemoteUrlUploadRequestController } from "../controllers/RemoteUrlUploadRequestController";
import { CrawlerController } from "../controllers/CrawlerController";
import { MediaSourceController } from "../controllers/MediaSourceController";

import asyncHandler from 'express-async-handler';

export class ApplicationRoutes {
  router: IRouter;
  playlistController: PlaylistController;
  playlistMediaItemsController: PlaylistMediaItemsController;
  mediaItemsController: MediaItemsController;
  remoteUrlUploadRequestController: RemoteUrlUploadRequestController;
  crawlerController: CrawlerController;
  mediaSourceController: MediaSourceController;
  constructor() {
    this.router = express.Router();
    this.playlistController = new PlaylistController();
    this.playlistMediaItemsController = new PlaylistMediaItemsController();
    this.mediaItemsController = new MediaItemsController();
    this.remoteUrlUploadRequestController = new RemoteUrlUploadRequestController();
    this.crawlerController = new CrawlerController();
    this.mediaSourceController = new MediaSourceController();

    this.router.route("/playlists").get(asyncHandler(this.playlistController.list));
    this.router.route("/playlists/:playlistId").get(asyncHandler(this.playlistController.get));
    this.router.route("/playlists").post(asyncHandler(this.playlistController.create));

    this.router.route("/playlists/:playlistId/items").get(asyncHandler(this.playlistMediaItemsController.list));
    this.router.route(["/playlists/:playlistId/items/:mediaItemId", "/items/:mediaItemId/playlists/:playlistId"]).put(asyncHandler(this.playlistMediaItemsController.addMediaItemToPlaylist));
    this.router.route(["/playlists/:playlistId/items/:mediaItemId", "/items/:mediaItemId/playlists/:playlistId"]).delete(asyncHandler(this.playlistMediaItemsController.removeMediaItemFromPlaylist));

    this.router.route("/items").get(asyncHandler(this.mediaItemsController.list));
    this.router.route("/items").post(asyncHandler(this.mediaItemsController.createMediaItem));
    this.router.route("/items/:mediaItemId").get(asyncHandler(this.mediaItemsController.get));
    this.router.route("/items/:mediaItemId").delete(asyncHandler(this.mediaItemsController.deleteMediaItem));

    this.router.route("/items/:mediaItemId/mediasources").get(asyncHandler(this.mediaSourceController.getByMediaItemId));    

    this.router.route("/items/:mediaItemId/favorite").put(asyncHandler(this.mediaItemsController.markItemAsFavorite));
    this.router.route("/items/:mediaItemId/favorite").delete(asyncHandler(this.mediaItemsController.unFavoriteItem));

    this.router.route("/items/:mediaItemId/externalIds/:externalId").put(asyncHandler(this.mediaItemsController.attachExternalIdToMediaItem));
    this.router.route("/items/:mediaItemId/externalIds").delete(asyncHandler(this.mediaItemsController.detachExternalIdFromMediaItem));

    this.router.route("/items/byExternalId/:externalId").get(asyncHandler(this.mediaItemsController.getByExternalId));
    this.router.route("/items/byExternalId/:externalId").post(asyncHandler(this.mediaItemsController.createMediaItemByExternalId));

    this.router.route("/remoteUrlUploadRequest").get(asyncHandler(this.remoteUrlUploadRequestController.list));
    this.router.route("/remoteUrlUploadRequest").post(asyncHandler(this.remoteUrlUploadRequestController.create));

    this.router.route("/crawler/hdhub").get(asyncHandler(this.crawlerController.fetchLatestHdhub));
    this.router.route("/crawler/hdhub").post(asyncHandler(this.crawlerController.crawlHdhub));

    this.router.route("/crawler/extramovies").get(asyncHandler(this.crawlerController.fetchLatestExtramovies));
    this.router.route("/crawler/extramovies").post(asyncHandler(this.crawlerController.crawlExtramovies));

    this.router.route("/mediasources/:mediaSourceId").get(asyncHandler(this.mediaSourceController.get));
    this.router.route("/mediasources").get(asyncHandler(this.mediaSourceController.list));
    this.router.route("/mediasources/:mediaSourceId/mediaItemId/:mediaItemId").put(asyncHandler(this.mediaSourceController.attachMediaItem));
    this.router.route("/mediasources/:mediaSourceId/byExternalId/:externalId").put(asyncHandler(this.mediaSourceController.attachByExternalId));
    
    this.router.route("/mediasources/:mediaSourceId/mediaItemId/:mediaItemId").delete(asyncHandler(this.mediaSourceController.detachMediaItem));
  }

  public getRoutes(): IRouter {
    return this.router;
  }
}
