import uniqid from "uniqid";
import { GetRemoteUrlUploadRequest, RemoteUrlUploadRequest } from "../models/remoteUrlUploadRequest";
import { GenericTransformer as _transformer } from "../transformers/genericTransformer";
import { RemoteUrlUploadDataService } from "./DataServices";
import { GdriveWrapperService } from './GdriveWrapperService';
import config from '../configs/config';

const _gdriveWrapperService = new GdriveWrapperService();

export class RemoteUrlUploadRequestService {
    public async getItems(status: string | undefined, requestId: string): Promise<GetRemoteUrlUploadRequest[]> {
        const query: any = {};
        status && (query["status"] = status);
        requestId && (query["requestId"] = requestId);
        var requests = await RemoteUrlUploadDataService.find(query);
        return requests && requests.map((x: any) =>
            x.toObject({
                transform: _transformer,
            }) as GetRemoteUrlUploadRequest
        );
    }

    public async createRequest(uploadRequest: RemoteUrlUploadRequest): Promise<String> {
        const requestId = uniqid();
        let sequence = 0;
        const payloadArray = [];
        const folderName = uploadRequest.mediaType === 'movie' ? config.driveFolderMovie : config.driveFolderTv;
        const { accessToken } = uploadRequest;
        const folderToCreate = `${uploadRequest.title} (${uploadRequest.year})`;
        const folderId = await _gdriveWrapperService.createFolder(folderName, accessToken, folderToCreate);

        for (const file of uploadRequest.files) {
            const remoteUrl = await _gdriveWrapperService.createResumableFile(folderId, accessToken, file);
            const payload = {
                requestId,
                fileName: file,
                fileUrl: uploadRequest.fileUrl,
                parentUrl: uploadRequest.parentUrl,
                sequence: sequence++,
                status: 'queued',
                remoteUrl
            };
            payloadArray.push(payload);
        }
        for (const payload of payloadArray) {
            await RemoteUrlUploadDataService.create(payload);
        }
        return requestId;
    }
}
