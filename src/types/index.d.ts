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