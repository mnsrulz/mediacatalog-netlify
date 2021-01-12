import * as mongoose from "mongoose";
import {
  NotFoundException,
  ValidationException,
} from "../exceptions/exceptions";
import { MediaItemSchema, RemoteUrlUploadRequestSchema } from "../models/schemas";
import { ExternalId, PlaylistItem } from "../models/playlist";
import { TmdbWrapperService } from "./tmbdWrapper";

const _tmdbWrapperService = new TmdbWrapperService();

export const MediaItemDataService = mongoose.model("MediaItemSchema", MediaItemSchema);


const playlistItemTransformer = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret["_id"];
  delete ret["__v"];
  return ret;
};

const knownExternalIdProviders = ["imdb", "tvdb", "tmdb"];
export class PlaylistMediaItemService {
  public async get(mediaItemId: any) {
    var playlist = await MediaItemDataService.findById(mediaItemId);
    if (playlist) {
      return playlist.toObject({
        transform: playlistItemTransformer,
      });
    }
    return null;
  }
  public async getItems(playlistId?: String): Promise<PlaylistItem[]> {
    const query: any = {};
    playlistId && (query["playlistIds"] = playlistId);
    var playlists = await MediaItemDataService.find(query);
    return playlists && playlists.map((x) =>
      x.toObject({
        transform: playlistItemTransformer,
      }) as PlaylistItem
    );
  }

  public async addMediaItem(item: PlaylistItem): Promise<String> {
    const itemToAdd = {
      title: item.title,
      year: item.year,
      itemType: item.itemType,
    };
    const createdDocument = await MediaItemDataService.create(itemToAdd);
    return createdDocument._id;
  }

  public async deleteMediaItem(mediaId: string): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);
    if (doc) {
      await MediaItemDataService.deleteOne({ _id: mediaId });
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async addMediaItemToPlaylist(
    mediaId: any,
    playlistId: any,
  ): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);
    if (doc) {
      if (doc.playlistIds.includes(playlistId)) {
        console.log("Item already exists in the playlist");
      } else {
        console.log("media to modify...", doc);
        await MediaItemDataService.updateOne({ _id: doc._id }, {
          $push: {
            playlistIds: playlistId,
          },
        });
      }
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async removeMediaItemFromPlaylist(
    mediaId: any,
    playlistId: any,
  ): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);
    if (doc) {
      if (doc.playlistIds.includes(playlistId)) {
        await MediaItemDataService.updateOne({ _id: doc._id }, {
          $pull: {
            playlistIds: playlistId,
          },
        });
      } else {
        console.log("Item does not exists in the playlist");
      }
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async attachExternalIdToMediaItem(
    mediaId: string,
    externalId: ExternalId,
  ): Promise<void> {
    const isKnownExternalProvider = knownExternalIdProviders.includes(
      externalId.type,
    );
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    }
    const doc: any = await MediaItemDataService.findById(mediaId);

    if (doc) {
      const externalIds: ExternalId[] = doc.externalIds;
      if (
        externalIds &&
        externalIds.some((x) =>
          x.type === externalId.type && x.id === externalId.id
        )
      ) {
        console.log(
          `External Id ${externalId.id} already associated with the media item.`,
        );
      } else {
        await MediaItemDataService.updateOne({ _id: doc._id }, {
          $push: {
            externalIds: externalId,
          },
        });
      }
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async detachExternalIdFromMediaItem(
    mediaId: string,
    externalId: ExternalId,
  ): Promise<void> {
    const isKnownExternalProvider = knownExternalIdProviders.includes(
      externalId.type,
    );
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    }
    const doc: any = await MediaItemDataService.findById(mediaId);

    if (doc) {
      const externalIds: ExternalId[] = doc.externalIds;
      if (
        externalIds &&
        externalIds.some((x) =>
          x.type === externalId.type && x.id === externalId.id
        )
      ) {
        await MediaItemDataService.updateOne({ _id: doc._id }, {
          $pull: {
            externalIds: externalId,
          },
        });
      } else {
        throw new ValidationException(
          "Requested external id not found in this media item id.",
        );
      }
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async getByExternalId(externalId: any, type: any) {
    console.log(externalId, type);
    const isKnownExternalProvider = knownExternalIdProviders.includes(type);
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    }

    var mediaItem = await MediaItemDataService.findOne(
      { externalIds: { id: externalId, type: type } },
    );
    if (mediaItem) {
      return mediaItem.toObject({
        transform: playlistItemTransformer,
      });
    }
    return null;
  }

  public async createMediaByExternalId(externalId: any, type: any) {
    console.log(externalId, type);
    const isKnownExternalProvider = knownExternalIdProviders.includes(type);
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    }

    var mediaItem = await MediaItemDataService.findOne(
      { externalIds: { id: externalId, type: type } },
    );
    if (mediaItem) {
      throw new ValidationException("External Id already present.");
    }

    const tmdbResponse:any = await _tmdbWrapperService.getByImdbId(externalId);

    const result = tmdbResponse.movie_results || tmdbResponse.tv_results;

    const itemToAdd = {
      title: result.name,
      year: result.year,
      itemType: result.itemType,
    };
    const createdDocument = await MediaItemDataService.create(itemToAdd);
    return createdDocument._id;

    // return tmdbResponse;
    // const itemToAdd = {
    //   title: item.title,
    //   year: item.year,
    //   itemType: item.itemType,
    // };
    // const createdDocument = await MediaItemDataService.create(itemToAdd);
    // return createdDocument._id;
  }
}