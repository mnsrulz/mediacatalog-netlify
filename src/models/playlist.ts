export interface Playlist {
  ts: Date;
  title: String;
}

export interface PlaylistItem {
  id: String;
  itemType: String;
  title: String;
  year: String;
  externalIds: ExternalId[];
  playlistIds: string[];
  backdropPath: string;
  posterPath: string;
  tagline: string;
  overview: string;
  runtime: string;
  customBackdropPath: string;
  customPosterPath: string;
}

export interface ExternalId {
  type: string;
  id: string;
}