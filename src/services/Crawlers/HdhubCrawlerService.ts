import { MediaSource } from '../../models/MediaSource';
import got from "got";
import { GenericWordpressResponse } from './GenericWordpressResponse';
const HBLINKS_API_BASE_URI = 'https://hblinks.pro';

export class HdhubCrawlerService {
    public async fetch(lastModified: Date | undefined): Promise<MediaSource[]> {
        let apiUrl = `${HBLINKS_API_BASE_URI}/wp-json/wp/v2/posts?orderby=modified&order=asc&per_page=100`;
        if (lastModified) {
            apiUrl = `${apiUrl}&modified_after=${encodeURIComponent(lastModified.toISOString())}`;
        }

        const response = await got(apiUrl, {
            responseType: 'json'
        });

        const responseData = response.body as GenericWordpressResponse[];
        const sources: MediaSource[] = [];
        responseData.forEach(x => {
            const source = {
                crawlerType: "hdhub",
                created: new Date(x.date),
                modified: new Date(x.modified),
                renderedContent: x.content.rendered,
                renderedTitle: x.title.rendered,
                slug: x.slug,
                webViewLink: x.link,
                externalId: x.id
            } as MediaSource;
            sources.push(source);
        });
        return sources;
    }
}


