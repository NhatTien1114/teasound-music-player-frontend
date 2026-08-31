export type TUserProfileResponse = {
    id?: number;
    authenticated: boolean;
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
    createdAt?: string | number[] | Date;
}

export type TAuthorResponse = {
    id?: number,
    name?: string,
    bio?: string,
    avatar?: string
}

export type TAllAuthors = {
    page?: number,
    limit?: number,
    search?: string
}

export type TSongResponse = {
    id?: number | undefined,
    name?: string,
    description?: string,
    thumbnailUrl?: string,
    duration?: string,
    authorId?: number | undefined,
    type?: TTypeSong,
    audioUrl?: string,
    videoUrl?: string,
    lyric?: string,
}

export type TAllSongs = {
    page?: number,
    limit?: number,
    search?: string,
    type?: string
}

export type TPaginatedResponse<T> = {
    content: T[],
    totalElements: number,
    totalPages: number,
    size: number,
    number: number,
    first: boolean,
    last: boolean,
    empty: boolean,
}

export type THistoryResponse = {
    id: number;
    songId: number;
    title: string;
    duration: string;
    thumbnailUrl: string;
    audioUrl: string;
    authorName: string;
    userId: number;
    playedAt: string;
}

export type TCreateHistoryRequest = {
    userId: number;
    songId: number;
}

export type TPlayerContext = {
    currentSong: TSongResponse | null;
    isPlaying: boolean;
    audioRef: React.RefObject<HTMLAudioElement>;
    currentTime: number;
    duration: number;
    playSong: (song: TSongResponse) => void;
    togglePlay: () => void;
    seek: (time: number) => void;
};

export type TPlaylistResponse = {
    id?: number;
    name?: string;
    thumbnailUrl?: string;
    coverImage?: string;
    isPublic?: boolean;
    songs?: TSongResponse[];
    user?: TUserProfileResponse;
    userId?: number;
}

export type TCreatePlaylistRequest = {
    name: string;
    thumbnailUrl?: string;
    songs?: TSongResponse[];
}

export type TCommentResponse = {
    id: number;
    content: string;
    songId: number;
    userId: number;
    userName: string;
    userAvatarUrl?: string;
    createdAt: string;
    parentCommentId?: number | null;
}

export type TCreateCommentRequest = {
    content: string;
    parentId?: number | null;
}
