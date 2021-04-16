//Caution before checkin this to source code
export default {
    tmdbApiSecret: process.env.TMDB_API_SECRET || "5c0c689d7e3f2a175015d5d171333312",
    driveFolderMovie: process.env.DRIVE_FOLDER_MOVIE,
    driveFolderTv: process.env.DRIVE_FOLDER_TV,
    mongoUri: process.env.MONGODB_URI || 'mongodb+srv://testuser:BCO6HUx3UU5W58Gk@cluster0.9m1ac.mongodb.net/mediacatalog?retryWrites=true&w=majority'
}