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
}

export interface ExternalId {
  type: string;
  id: string;
}