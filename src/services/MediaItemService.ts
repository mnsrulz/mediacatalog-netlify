import {
  NotFoundException,
  ValidationException,
} from "../exceptions/exceptions";
import { ExternalId } from "../models/ExternalId";
import { MediaItem } from "../models/MediaItem";
import { TmdbWrapperService } from "./TmdbWrapperService";
import { MediaItemDataService, MediaSourceDataService } from "./DataServices";
import { PagedRespone } from "../models/PagedRespone";

import { GenericTransformer as playlistItemTransformer } from "../transformers/genericTransformer";

const _tmdbWrapperService = new TmdbWrapperService();

export type MediaItemType = 'movie' | 'tv';

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
  public async getItems(type?: MediaItemType, search?: string): Promise<MediaItem[]> {
    const query: any = {};
    if (type && ['movie', 'tv'].includes(type)) {
      query['itemType'] = type;
    }
    if (search) {
      query['title'] = new RegExp(search, 'i');
    }

    var items = await MediaItemDataService.find(query).sort('-_id').limit(100);
    return items && items.map((x: any) =>
      x.toObject({
        transform: playlistItemTransformer,
      }) as MediaItem
    );
  }

  public async getItemsByType(type?: MediaItemType): Promise<PagedRespone<MediaItem>> {
    const query = { itemType: type };
    var itemsQuery = await MediaItemDataService.find(query).sort('-_id').limit(200);
    const items = itemsQuery && itemsQuery.map(x =>
      x.toObject({
        transform: playlistItemTransformer,
      }) as MediaItem
    );
    return {
      items,
      total: 0,
      count: items.length,
      pageNumber: 1,
      pageSize: 0
    }
  }

  public async getPlaylistItems(playlistId: String): Promise<PagedRespone<MediaItem>> {
    const query: any = {};
    if (playlistId) {
      query["playlistIds"] = { $elemMatch: { "playlistId": playlistId } };
      var playlistItems = await MediaItemDataService.find(query).limit(100);
      playlistItems.sort((a, b) => {
        const firstItem = a.playlistIds.find(x => x.playlistId === playlistId)?.rank || '';
        const secondItem = b.playlistIds.find(x => x.playlistId === playlistId)?.rank || '';
        return firstItem.localeCompare(secondItem);
      });
      const items = playlistItems && playlistItems.map(x =>
        x.toObject({
          transform: playlistItemTransformer
        }) as MediaItem
      );

      return {
        items,
        total: 0,
        count: items.length,
        pageNumber: 1,
        pageSize: 0
      }
    } else {
      throw new ValidationException('Playlist id is required');
    }
  }

  public async getSpecializedCrawlerTypeItems(crawlerType: string, pageSize: number): Promise<PagedRespone<MediaItem>> {
    if (pageSize > 200) throw new ValidationException('Page size limit is 200 maximum');
    const sortedMediaItemIds = await MediaSourceDataService.aggregate([
      { $match: { "crawlerType": crawlerType, "mediaItemId": { $ne: null } } },
      { $group: { "_id": "$mediaItemId", "lastModified": { $max: "$modified" } } },
      { $sort: { "lastModified": -1 } },
      { $limit: pageSize }
    ]); //known issue page size won't work well with aggregation

    const qualifiedIds = sortedMediaItemIds.map(x => x._id);
    const items = await this.findByIds(qualifiedIds);

    return {
      items,
      total: 0,
      count: items.length,
      pageNumber: 1,
      pageSize
    }
  }

  private async findByIds(qualifiedIds: any[]): Promise<MediaItem[]> {
    const mediaItems = await MediaItemDataService.find({
      '_id': {
        $in: qualifiedIds
      }
    });
    mediaItems.sort((a, b) => { return qualifiedIds.indexOf(a.id) - qualifiedIds.indexOf(b.id); });
    const items = mediaItems && mediaItems.map(x =>
      x.toObject({
        transform: playlistItemTransformer
      }) as MediaItem
    );
    return items;
  }

  private async findByTmbdIds(qualifiedIds: any[], type: string): Promise<MediaItem[]> {
    const mediaItems = await MediaItemDataService.find({
      "tmdbId": {
        $in: qualifiedIds
      },
      "itemType": type
    });
    mediaItems.sort((a, b) => { return qualifiedIds.indexOf(a.tmdbId) - qualifiedIds.indexOf(b.tmdbId); });
    const items = mediaItems && mediaItems.map(x =>
      x.toObject({
        transform: playlistItemTransformer
      }) as MediaItem
    );
    return items;
  }

  public async listTmdbTrending(type: 'movie' | 'tv'): Promise<PagedRespone<MediaItem>> {
    const qualifiedIds = await _tmdbWrapperService.getTrending(type);
    const items = await this.findByTmbdIds(qualifiedIds, type);
    return {
      items,
      total: 0,
      count: items.length,
      pageNumber: 1,
      pageSize: 200
    };
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
    mediaId: string,
    playlistId: string
  ): Promise<void> {
    const mediaItem = await MediaItemDataService.findById(mediaId);
    if (mediaItem) {
      if (mediaItem.playlistIds.some(x => x.playlistId === playlistId)) {
        throw new ValidationException("Item already exists in the playlist");
      } else {
        const _baseRank = '55i6j7k8l9mbg0' //(parseInt('abcdefghijklmn', 24)/2).toString(24)
        const rank = (parseInt(_baseRank, 24) - (new Date().getTime())).toString(24);
        await MediaItemDataService.findByIdAndUpdate(mediaItem._id, {
          $push: { playlistIds: { playlistId, rank } },
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