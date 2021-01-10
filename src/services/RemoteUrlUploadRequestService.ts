import * as mongoose from "mongoose";
import uniqid from "uniqid";
import { RemoteUrlUploadRequest } from "../models/remoteUrlUploadRequest";
import { RemoteUrlUploadRequestSchema } from "../models/schemas";

export const RemoteUrlUploadDataService = mongoose.model("RemoteUrlUploadRequestSchema", RemoteUrlUploadRequestSchema);

export class RemoteUrlUploadRequestService {
    public async createRequest(uploadRequest: RemoteUrlUploadRequest): Promise<String> {
        const requestId = uniqid();
        let sequence = 0;
        for (const file of uploadRequest.files) {
            const payload = {
                requestId,
                fileName: file,
                fileUrl: uploadRequest.fileUrl,
                sequence: sequence++
            };
            await RemoteUrlUploadDataService.create(payload);
        }
        return requestId;
    }
}
