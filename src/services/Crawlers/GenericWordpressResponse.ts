export interface GenericWordpressResponse {
    id: string;
    content: {
        rendered: string;
    };
    link: string;
    date: Date;
    modified: Date;
    slug: string;
    title: {
        rendered: string;
    };
}
