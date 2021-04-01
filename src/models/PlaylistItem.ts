import { Document } from 'mongoose';

export interface Playlist extends Document {
  ts: Date;
  title: String;
}