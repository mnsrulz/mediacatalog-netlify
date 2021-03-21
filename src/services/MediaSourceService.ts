import * as mongoose from "mongoose";
import { MediaSource } from "../models/MediaSource";
import { PagedRespone } from "../models/PagedRespone";
import { MediaSourceSchema } from "../models/ModelSchemas";
import { NotFoundException } from "../exceptions/exceptions";
import { MediaNameParserService } from "./Crawlers/MediaNameParserService";
export const MediaSourceDataService = mongoose.model("MediaSourceSchema", MediaSourceSchema);
const _mediaNameParserService = new MediaNameParserService();

const _transformer = (doc: any, ret: any) => {
    ret.id = ret._id;
    ret.parsedInfo = _mediaNameParserService.parse(ret.renderedTitle);
    delete ret["_id"];
    delete ret["__v"];
    return ret;
};

export class MediaSourceService {
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

    public async getItems(pageNumber: number, pageSize: number, search?: string,): Promise<PagedRespone<MediaSource>> {
        const query: any = {};
        if (search) {
            query['renderedTitle'] = new RegExp(search, 'i');
        }
        const skip = (pageNumber - 1) * pageSize;
        const total = await MediaSourceDataService.find(query).estimatedDocumentCount();
        const items = await MediaSourceDataService.find(query).sort({ '_id': -1 }).skip(skip).limit(pageSize);
        const itemsArray = items && items.map((x:any) =>
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

    public async attachMediaItem(mediaSourceId: string, mediaItemId: string): Promise<void> {
        const doc: any = await MediaSourceDataService.findById(mediaSourceId);
        if (doc) {
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
}
