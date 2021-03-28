export interface GenericWordpressResponse {
    id: string;
    content: {
        rendered: string;
    };
    link: string;
    date: Date;
    modified: Date;
    date_gmt: Date;
    modified_gmt: Date;
    slug: string;
    title: {
        rendered: string;
    };
}
