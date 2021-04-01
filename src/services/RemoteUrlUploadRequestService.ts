import uniqid from "uniqid";
import { GetRemoteUrlUploadRequest, RemoteUrlUploadRequest } from "../models/remoteUrlUploadRequest";
import { GenericTransformer as _transformer } from "../transformers/genericTransformer";
import { RemoteUrlUploadDataService } from "./DataServices";

export class RemoteUrlUploadRequestService {
    public async getItems(status: string | undefined): Promise<GetRemoteUrlUploadRequest[]> {
        const query: any = {};
        status && (query["status"] = status);
        var requests = await RemoteUrlUploadDataService.find(query);
        return requests && requests.map((x:any) =>
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
