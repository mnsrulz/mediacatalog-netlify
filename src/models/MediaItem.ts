import { Document } from 'mongoose';

export interface MediaItem extends Document {
  id: string;
  itemType: string;
  title: string;
  year: string;
  playlistIds: {    
    playlistId: string,
    rank: string
  }[];
  backdropPath: string;
  posterPath: string;
  tagline: string;
  overview: string;
  runtime: string;
  customBackdropPath: string;
  customPosterPath: string;
  tmdbId: string;
  imdbId: string;
}
