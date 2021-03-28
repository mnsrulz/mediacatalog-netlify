import * as mongoose from "mongoose";
import {
  NotFoundException,
  ValidationException,
} from "../exceptions/exceptions";
import { MediaItemSchema } from "../models/ModelSchemas";
import { ExternalId } from "../models/ExternalId";
import { MediaItem } from "../models/MediaItem";
import { TmdbWrapperService } from "./TmdbWrapperService";

const _tmdbWrapperService = new TmdbWrapperService();

export const MediaItemDataService = mongoose.model<MediaItem>("MediaItemSchema", MediaItemSchema);


const playlistItemTransformer = (doc: any, ret: any) => {
  ret.id = ret._id;
  delete ret["_id"];
  delete ret["__v"];
  return ret;
};

const knownExternalIdProviders = ["imdb", "tvdb", "tmdb"];
export class PlaylistMediaItemService {
  public async get(mediaItemId: any) {
    var mediaItem = await MediaItemDataService.findById(mediaItemId);
    if (mediaItem) {
      return mediaItem.toObject({
        transform: playlistItemTransformer,
      });
    }
    throw new NotFoundException(mediaItemId);
  }
  public async getItems(type?: string, search?: string): Promise<MediaItem[]> {
    const query: any = {};
    if (type && ['movie', 'tv'].includes(type)) {
      query['itemType'] = type;
    }
    if (search) {
      query['title'] = new RegExp(search, 'i');
    }

    var items = await MediaItemDataService.find(query).limit(100);
    return items && items.map((x: any) =>
      x.toObject({
        transform: playlistItemTransformer,
      }) as MediaItem
    );
  }
  public async getPlaylistItems(playlistId: String): Promise<MediaItem[]> {
    const query: any = {};
    if (playlistId) {
      query["playlistIds"] = { $elemMatch: { "playlistId": playlistId } };
      var playlists = await MediaItemDataService.find(query);
      return playlists && playlists.map(x =>
        x.toObject({
          transform: playlistItemTransformer
        }) as MediaItem
      );
    } else {
      throw new ValidationException('Playlist id is required');
    }
  }

  public async addMediaItem(item: MediaItem): Promise<String> {
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
    playlistId: any
  ): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);
    if (doc) {
      if (doc.playlistIds.map((x: any) => x.playlistId).includes(playlistId)) {
        console.log("Item already exists in the playlist");
      } else {
        await MediaItemDataService.findByIdAndUpdate(doc._id, {
          $push: { "playlistIds": { "playlistId": playlistId, rank: 'defaultrank' } },
        }, { useFindAndModify: false });
      }
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async removeMediaItemFromPlaylist(
    mediaId: string,
    playlistId: string,
  ): Promise<void> {
    const doc = await MediaItemDataService.findById(mediaId);
    if (doc) {
      if (doc.playlistIds.some(x => x.playlistId === playlistId)) {
        await MediaItemDataService.findByIdAndUpdate(doc._id, {
          $pull: { playlistIds: { playlistId } },
        }, { useFindAndModify: false });
      } else {
        throw new ValidationException('Media item is not associated Playlist');
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
      const propToUpdate: any = {};
      propToUpdate[`${externalId.type}Id`] = externalId.id;
      await MediaItemDataService.updateOne({ _id: doc._id }, propToUpdate);
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async detachExternalIdFromMediaItem(
    mediaId: string,
    externalIdType: string,
  ): Promise<void> {
    const isKnownExternalProvider = knownExternalIdProviders.includes(
      externalIdType,
    );
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    }
    const doc: any = await MediaItemDataService.findById(mediaId);

    if (doc) {
      const propToUpdate: any = {};
      propToUpdate[`${externalIdType}Id`] = 1;
      await MediaItemDataService.updateOne({ _id: doc._id }, {
        $unset: propToUpdate
      });
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async getByExternalId(extId: ExternalId) {
    const isKnownExternalProvider = knownExternalIdProviders.includes(extId.type);
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    }

    let searchDelegate: any = {};
    searchDelegate[`${extId.type}Id`] = extId.id;

    var mediaItem = await MediaItemDataService.findOne(
      searchDelegate
    );
    if (mediaItem) {
      return mediaItem.toObject({
        transform: playlistItemTransformer,
      });
    } else {
      throw new NotFoundException(extId.id);
    }
  }

  public async createMediaByExternalId(extId: ExternalId) {
    const isKnownExternalProvider = knownExternalIdProviders.includes(extId.type);
    if (!isKnownExternalProvider) {
      throw new ValidationException("Invalid External Provider");
    } else if (extId.type === 'imdb') {
      //pass
    } else if (extId.type === 'tmdb' && ['movie', 'tv'].includes(extId.tmdbHint)) {
      //pass
    } else {
      throw new ValidationException('Error in parsing External Provider');
    }

    if (!extId.id) throw new ValidationException("External Id must not be empty");

    let searchDelegate: any = {};
    searchDelegate[`${extId.type}Id`] = extId.id;
    if (extId.type === 'tmdb') {
      searchDelegate[`type`] = extId.tmdbHint;
    }

    var mediaItem = await MediaItemDataService.findOne(
      searchDelegate
    );

    if (mediaItem) {
      throw new ValidationException("External Id already present.");
    }
    let itemToAdd;
    if (extId.type === 'imdb') {
      itemToAdd = await _tmdbWrapperService.getByImdbId(extId.id);
    } else {
      itemToAdd = await _tmdbWrapperService.getByTmdbId(extId.id, extId.tmdbHint);
    }
    const createdDocument = await MediaItemDataService.create(itemToAdd);
    return createdDocument._id;
  }

  public async markItemAsFavorite(
    mediaId: string
  ): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);

    if (doc) {
      await MediaItemDataService.updateOne({ _id: doc._id }, {
        favorite: true
      });
    } else {
      throw new NotFoundException(mediaId);
    }
  }

  public async unFavoriteItem(
    mediaId: string
  ): Promise<void> {
    const doc: any = await MediaItemDataService.findById(mediaId);
    if (doc) {
      await MediaItemDataService.updateOne({ _id: doc._id }, {
        favorite: false
      });
    } else {
      throw new NotFoundException(mediaId);
    }
  }
}