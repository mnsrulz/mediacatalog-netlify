const parser = require('@ctrl/video-filename-parser');

export class MediaNameParserService {
    public parse(title: string) {
        try {
            if (title) {
                const parsedAsMovie = parser.filenameParse(title);
                if (parsedAsMovie.year) {
                    return parsedAsMovie;
                } else {
                    const parsedAsTv = parser.filenameParse(title, true);
                    return parsedAsTv;
                }
            }                
        } catch (error) {
            console.log('Error while parsing the media name: ', title);
        }
        return null;
    }
}