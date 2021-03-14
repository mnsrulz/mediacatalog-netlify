import * as mongoose from "mongoose";
import { MediaSource } from "../models/MediaSource";
import { MediaSourceSchema } from "../models/ModelSchemas";

export const MediaSourceDataService = mongoose.model("MediaSourceSchema", MediaSourceSchema);

const _transformer = (doc: any, ret: any) => {
    ret.id = ret._id;
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
        const upsertResult = await MediaSourceDataService.findOneAndUpdate({
            crawlerType: mediaSource.crawlerType,
            externalId: mediaSource.externalId
        }, mediaSource, { upsert: true });
        return upsertResult;
    }
}
