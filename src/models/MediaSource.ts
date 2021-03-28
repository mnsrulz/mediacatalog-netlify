import { Document } from 'mongoose';
export interface MediaSource extends Document {
  externalId: string,
  webViewLink: string,
  created: Date,
  modified: Date,
  slug: string,
  renderedContent: string,
  renderedTitle: string,
  crawlerType: 'hdhub' | 'extramovies' | 'other',
  parserInfo: object
}