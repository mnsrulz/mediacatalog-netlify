export interface Playlist {
    ts: Date,
    title: String
}

export interface PlaylistItem{
    id: String,
    itemType: String,
    title: String,
    year: String,
    externalIds: Record<string, string>,
    playlistIds: [{type:String}]
}