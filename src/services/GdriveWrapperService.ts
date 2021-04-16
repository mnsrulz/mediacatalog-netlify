import got from "got";

export class GdriveWrapperService {
    public async createResumableFile(rootId: string, accessToken: string, fileName: string): Promise<string> {
        const response = await got.post('https://www.googleapis.com/upload/drive/v3/files?uploadType=resumable', {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'X-Upload-Content-Type': getMimeType(fileName)
            },
            json: {
                name: fileName,
                parents: [rootId]
            },
            retry: {
                limit: 3,
                methods: ['POST']
            }
        });
        if (response.headers['location']) return response.headers['location'];
        throw new Error('Unable to create file');
    }

    public async createFolder(rootId: string, accessToken: string, folderName: string): Promise<string> {
        const existingFolder = await getFolderIdIfExists(rootId, accessToken, folderName);
        if (existingFolder) return existingFolder;

        const response = await got.post<{ id: string }>('https://www.googleapis.com/drive/v3/files', {
            searchParams: {
                supportsAllDrives: true
            },
            headers: {
                'Authorization': `Bearer ${accessToken}`
            },
            json: {
                name: folderName,
                parents: [rootId],
                mimeType: 'application/vnd.google-apps.folder'
            },
            responseType: 'json',
            resolveBodyOnly: true
        });
        if (response.id) return response.id;
        throw new Error('Unable to create file');
    }
}

const getMimeType = (fileName: string) => {
    //do the mapping here...
    return 'application/octet-stream';
}

const getFolderIdIfExists = async (rootId: string, accessToken: string, folderName: string): Promise<string | undefined> => {
    const response = await got<DriveFileSearchResponse>('https://www.googleapis.com/drive/v3/files', {
        searchParams: {
            includeItemsFromAllDrives: true,
            supportsAllDrives: true,
            q: `'${rootId}' in parents and mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}'`
        },
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        responseType: "json",
        resolveBodyOnly: true
    });
    if (response.files.length > 0) {
        return response.files[0].id;
    }
    return undefined;
}

interface DriveFileSearchResponse {
    files: {
        id: string
    }[]
}
