//Caution before checkin this to source code
export default {
    tmdbApiSecret: process.env.TMDB_API_SECRET || "",
    driveFolderMovie: process.env.DRIVE_FOLDER_MOVIE || "",
    driveFolderTv: process.env.DRIVE_FOLDER_TV || "",
    mongoUri: process.env.MONGODB_URI || ''
}