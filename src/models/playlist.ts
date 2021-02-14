export interface Playlist {
  ts: Date;
  title: String;
}

export interface PlaylistItem {
  id: string;
  itemType: string;
  title: string;
  year: string;
  playlistIds: string[];
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

export interface ExternalId {
  type: string;
  id: string;
}