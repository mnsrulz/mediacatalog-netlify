import * as mongoose from "mongoose";
import uniqid from "uniqid";
import { GetRemoteUrlUploadRequest, RemoteUrlUploadRequest } from "../models/remoteUrlUploadRequest";
import { RemoteUrlUploadRequestSchema } from "../models/ModelSchemas";

export const RemoteUrlUploadDataService = mongoose.model("RemoteUrlUploadRequestSchema", RemoteUrlUploadRequestSchema);

const _transformer = (doc: any, ret: any) => {
    ret.id = ret._id;
    delete ret["_id"];
    delete ret["__v"];
    return ret;
};


export class RemoteUrlUploadRequestService {
    public async getItems(status: string | undefined): Promise<GetRemoteUrlUploadRequest[]> {
        const query: any = {};
        status && (query["status"] = status);
        var requests = await RemoteUrlUploadDataService.find(query);
        return requests && requests.map((x) =>
            x.toObject({
                transform: _transformer,
            }) as GetRemoteUrlUploadRequest
        );
    }

    public async createRequest(uploadRequest: RemoteUrlUploadRequest): Promise<String> {
        const requestId = uniqid();
        let sequence = 0;
        for (const file of uploadRequest.files) {
            const payload = {
                requestId,
                fileName: file,
                fileUrl: uploadRequest.fileUrl,
                sequence: sequence++,
                status: 'queued'
            };
            await RemoteUrlUploadDataService.create(payload);
        }
        return requestId;
    }
}
