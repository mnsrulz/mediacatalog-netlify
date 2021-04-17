import uniqid from "uniqid";
import { GetRemoteUrlUploadRequest, RemoteUrlUploadRequest } from "../models/remoteUrlUploadRequest";
import { GenericTransformer as _transformer } from "../transformers/genericTransformer";
import { RemoteUrlUploadDataService } from "./DataServices";
import { GdriveWrapperService } from './GdriveWrapperService';
import config from '../configs/config';
import { NotFoundException } from "../exceptions/exceptions";

const _gdriveWrapperService = new GdriveWrapperService();

export class RemoteUrlUploadRequestService {
    public async getItems(status: string | undefined, requestId: string): Promise<GetRemoteUrlUploadRequest[]> {
        const query: any = {};
        status && (query["status"] = status);
        requestId && (query["requestId"] = requestId);
        var requests = await RemoteUrlUploadDataService.find(query).sort({ _id: -1 });
        return requests && requests.map((x: any) =>
            x.toObject({
                transform: _transformer,
            }) as GetRemoteUrlUploadRequest
        );
    }

    public async getById(id: string): Promise<GetRemoteUrlUploadRequest | null> {
        var request: any = await RemoteUrlUploadDataService.findById(id);
        if (request) {
            return request.toObject({
                transform: _transformer,
            }) as GetRemoteUrlUploadRequest;
        }
        throw new NotFoundException(id);
    }

    public async updateStatus(id: string, status: 'running' | 'completed' | 'error' | 'queued', message: string): Promise<void> {
        //apply some validations
        var request: any = await RemoteUrlUploadDataService.findById(id);
        if (request) {
            await RemoteUrlUploadDataService.updateOne({ _id: request._id }, {
                status,
                message
            })
        } else {
            throw new NotFoundException(id);
        }
    }

    public async updateProgress(id: string, payload: { size: number, uploaded: number }): Promise<void> {
        //apply some validations
        var request: any = await RemoteUrlUploadDataService.findById(id);
        const payloadToUpdate = {
            size: payload.size,
            uploaded: payload.uploaded
        }
        if (request) {
            await RemoteUrlUploadDataService.updateOne({ _id: request._id }, {
                progress: payloadToUpdate
            })
        } else {
            throw new NotFoundException(id);
        }
    }

    public async createRequest(uploadRequest: RemoteUrlUploadRequest): Promise<String> {
        const requestId = uniqid();
        let sequence = 0;
        const payloadArray = [];
        const folderName = uploadRequest.mediaType === 'movie' ? config.driveFolderMovie : config.driveFolderTv;
        const { accessToken } = uploadRequest;
        const folderToCreate = `${uploadRequest.title} (${uploadRequest.year})`;
        const folderId = await _gdriveWrapperService.createFolder(folderName, accessToken, folderToCreate);

        //if files are multiple it implies that this is a non raw upload type.
        for (const file of uploadRequest.files) {
            const remoteUrl = await _gdriveWrapperService.createResumableFile(folderId, accessToken, file);
            const payload = {
                requestId,
                fileName: file,
                fileUrl: uploadRequest.fileUrl,
                parentUrl: uploadRequest.parentUrl,
                sequence: sequence++,
                status: 'queued',
                remoteUrl,
                rawUpload: uploadRequest.rawUpload
            };
            payloadArray.push(payload);
        }
        for (const payload of payloadArray) {
            await RemoteUrlUploadDataService.create(payload);
        }
        return requestId;
    }
}
