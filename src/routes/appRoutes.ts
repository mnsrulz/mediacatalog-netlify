import { Request, Response, NextFunction, IRouter } from "express";
import express from "express";

import { PlaylistController } from "../controllers/PlaylistController";
import { PlaylistMediaItemsController } from "../controllers/PlaylistMediaItemsController";
import { MediaItemsController } from "../controllers/MediaItemsController";

import asyncHandler from 'express-async-handler';

export class ApplicationRoutes {
  router: IRouter;
  playlistController: PlaylistController;
  playlistMediaItemsController: PlaylistMediaItemsController;
  mediaItemsController: MediaItemsController;
  constructor() {
    this.router = express.Router();
    this.playlistController = new PlaylistController();
    this.playlistMediaItemsController = new PlaylistMediaItemsController();
    this.mediaItemsController = new MediaItemsController();

    this.router.route("/playlists").get(asyncHandler(this.playlistController.list));
    this.router.route("/playlists/:playlistId").get(asyncHandler(this.playlistController.get));
    this.router.route("/playlists").post(asyncHandler(this.playlistController.create));

    this.router.route("/playlists/:playlistId/items").get(asyncHandler(this.playlistMediaItemsController.list));
    this.router.route("/playlists/:playlistId/items").post(asyncHandler(this.playlistMediaItemsController.addMediaItemToPlaylist));
    this.router.route("/playlists/:playlistId/items").delete(asyncHandler(this.playlistMediaItemsController.deleteMediaItemToPlaylist));

    this.router.route("/items").get(asyncHandler(this.mediaItemsController.list));
    this.router.route("/items").post(asyncHandler(this.mediaItemsController.createMediaItem));
    this.router.route("/items/:mediaItemId").get(asyncHandler(this.mediaItemsController.get));
    this.router.route("/items/:mediaItemId").delete(asyncHandler(this.mediaItemsController.deleteMediaItem));

    this.router.route("/items/:mediaItemId/externalIds").post(asyncHandler(this.mediaItemsController.attachExternalIdToMediaItem));
    this.router.route("/items/:mediaItemId/externalIds").delete(asyncHandler(this.mediaItemsController.detachExternalIdFromMediaItem));
    this.router.route("/items/:mediaItemId/playlists").post(asyncHandler(this.playlistMediaItemsController.addMediaItemToPlaylist));
    this.router.route("/items/:mediaItemId/playlists").delete(asyncHandler(this.playlistMediaItemsController.removeMediaItemFromPlaylist));
  }



  public getRoutes(): IRouter {
    return this.router;
  }
}
