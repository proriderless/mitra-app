//Global Enums

export enum EBasePage {
    HOME = 'Home',
    ANIME = 'Anime',
    MANGA = 'Manga',
    GALLERY = 'Gallery',
    PRODUCTIVITY = 'Productivity'
  }

export enum EGallery {
    EXPLORER = 'Explorer',
}

export enum EAnime {
    SEARCH_VIEWER = 'Search Viewer',
    SEASON_VIEWER = 'Season Viewer',
    TORRENT_VIEWER = 'Torrent Viewer'
}

export enum EManga {
    SEARCH_VIEWER = 'Manga Search Viewer'
}

export enum EProductivity {
    MAIN_CALENDAR = 'Main Calendar'
}

export enum EIpcListener {
    OPEN_IMAGE_DIRECTORY_SELECT = 'dialog:openMediaDirectorySelect',
    OPEN_VIDEO = 'dialog:openMediaFile',
    CODEC_TRANSFORM_VIDEO = "codec:transformVideo",
    RETRIEVE_SUBTITLES = "video:getSubtitles",
    STARTUP_FOLDER = "folder:openStartupFolder",
}

export enum ESchedulerIpcListener {
    UPDATE_SCHEDULE_FILE = 'update:scheduleFile',
    RETRIEVE_SCHEDULE_FILE = 'retrieve:scheduleFile'
}

export enum EMiscIpcListener {
    OPEN_EXTERNAL_LINK = 'misc:OpenExternalLink'
}

export enum ETorrentIpcListener {
    OPEN_TORRENT_LISTENER = "torrent:openTorrentServer",
    DESTROY_TORRENT_SERVER = "torrent:destroyTorrentClient",
    HANDLE_PARSED_TITLES = "torrent:returnParsedTitles"
}

export enum EUpdateMode {
    UPDATE = 'update',
    NEW = 'new',
    DELETE = 'delete'
}

export enum EAlertType {
    SUCCESS = 'success',
    ERROR = 'error',
    INFO = 'info',
    WARNING = 'warning'
}

export enum Resolution {
    STANDARD_HD = "720p",
    NORMAL_HD = "1080p"
}