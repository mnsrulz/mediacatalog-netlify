import * as mongoose from "mongoose";
import { MediaSource } from "../models/MediaSource";
import { PagedRespone } from "../models/PagedRespone";
import { MediaSourceSchema } from "../models/ModelSchemas";
import { NotFoundException, ValidationException } from "../exceptions/exceptions";
import { MediaNameParserService } from "./Crawlers/MediaNameParserService";
import { ExternalId } from "../models/ExternalId";
import { PlaylistMediaItemService } from "../services/MediaItemService";
export const MediaSourceDataService = mongoose.model("MediaSourceSchema", MediaSourceSchema);
const _mediaNameParserService = new MediaNameParserService();
const _playlistMediaItemService = new PlaylistMediaItemService();

const _transformer = (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret["_id"];
    delete ret["__v"];
    return ret;
};

export class MediaSourceService {
    public async getById(id: string): Promise<MediaSource> {
        const latestMediaSource = await MediaSourceDataService.findById(id);
        if (latestMediaSource) {
            return latestMediaSource.toObject({
                transform: _transformer,
            }) as MediaSource;
        }
        throw new NotFoundException(id);
    }

    public async findLastModifiedMediaSource(crawlerType: 'hdhub' | 'extramovies'): Promise<MediaSource | null> {
        const latestMediaSource = await MediaSourceDataService.findOne({
            crawlerType: crawlerType
        }).sort('-modified');

        if (latestMediaSource) {
            return latestMediaSource.toObject({
                transform: _transformer,
            }) as MediaSource;
        }
        return null;
    }

    public async upsertMediaSource(mediaSource: MediaSource): Promise<any> {
        mediaSource.parserInfo = mediaSource.parserInfo || _mediaNameParserService.parse(mediaSource.renderedTitle);
        const upsertResult = await MediaSourceDataService.findOneAndUpdate({
            crawlerType: mediaSource.crawlerType,
            externalId: mediaSource.externalId
        }, mediaSource, { upsert: true });
        return upsertResult;
    }

    public async getItems(pageNumber: number, pageSize: number, search?: string, onlyPendingMediaItem?: boolean, parsedTitle?: string): Promise<PagedRespone<MediaSource>> {
        const query: any = {};
        if (search) {
            query['renderedTitle'] = new RegExp(search, 'i');
        }
        if (parsedTitle) {
            query['parserInfo.title'] = parsedTitle;
        }
        if (onlyPendingMediaItem) {
            query['mediaItemId'] = null;
        }
        const skip = (pageNumber - 1) * pageSize;
        const total = await MediaSourceDataService.countDocuments(query);
        const items = await MediaSourceDataService.find(query).sort({ 'modified': -1 }).skip(skip).limit(pageSize);
        const itemsArray = items && items.map((x: any) =>
            x.toObject({
                transform: _transformer,
            }) as MediaSource
        );
        return {
            items: itemsArray,
            pageNumber,
            pageSize,
            total,
            count: items.length
        } as PagedRespone<MediaSource>
    }

    public async getItemsByMediaItemId(mediaItemId: string): Promise<MediaSource[]> {
        if (!mediaItemId) throw new ValidationException("media item id must not be empty");
        const query = {
            mediaItemId
        };
        const items = await MediaSourceDataService.find(query);
        const itemsArray = items && items.map((x: any) =>
            x.toObject({
                transform: _transformer,
            }) as MediaSource
        );
        return itemsArray;
    }

    public async attachMediaItem(mediaSourceId: string, mediaItemId: string): Promise<void> {
        const doc: any = await MediaSourceDataService.findById(mediaSourceId);
        if (doc) {
            if (doc.mediaItemId) throw new ValidationException("Media Item already attached to this.");
            const propToUpdate: any = {};
            propToUpdate[`mediaItemId`] = mediaItemId;
            await MediaSourceDataService.updateOne({ _id: doc._id }, propToUpdate);
        } else {
            throw new NotFoundException(mediaSourceId);
        }
    }

    public async detachMediaItem(mediaSourceId: string, mediaItemId: string): Promise<void> {
        const doc: any = await MediaSourceDataService.findById(mediaSourceId);
        if (doc) {
            const propToUpdate: any = {};
            propToUpdate[`mediaItemId`] = mediaItemId;
            await MediaSourceDataService.updateOne({ _id: doc._id }, { $unset: propToUpdate });
        } else {
            throw new NotFoundException(mediaSourceId);
        }
    }

    public async attachByExternalId(mediaSourceId: string, extId: ExternalId): Promise<void> {
        let mediaItemId;
        try {
            const { id } = await _playlistMediaItemService.getByExternalId(extId);
            mediaItemId = id;
        } catch (err) {
            if (err instanceof NotFoundException) {
                mediaItemId = await _playlistMediaItemService.createMediaByExternalId(extId);
            } else {
                throw err;
            }
        }
        await this.attachMediaItem(mediaSourceId, mediaItemId);
    }
}
