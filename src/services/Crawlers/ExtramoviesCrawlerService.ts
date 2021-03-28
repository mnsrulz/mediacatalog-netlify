import { MediaSource } from '../../models/MediaSource';
import got from "got";
const EXTRAMOVIES_API_BASE_URI = 'https://extramovies.team';
import { GenericWordpressResponse } from "./GenericWordpressResponse";


export class ExtramoviesCrawlerService {
    public async fetch(lastModified: Date | undefined): Promise<MediaSource[]> {
        let apiUrl = `${EXTRAMOVIES_API_BASE_URI}/wp-json/wp/v2/posts?orderby=modified&order=asc&per_page=100`;
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
                crawlerType: "extramovies",
                created: new Date(x.date_gmt),
                modified: new Date(x.modified_gmt),
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
