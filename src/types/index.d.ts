export type TUserProfileResponse = {
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

export type TSongResponse = {
    id?: number | undefined,
    name?: string,
    description?: string,
    thumbnailUrl?: string,
    duration?: string,
    authorId?: number | undefined,
    type?: keyof TTypeSong,
    audioUrl?: string,
    videoUrl?: string,
}

export type TTypeSong = {
    POP: "POP",
    ROCK: "ROCK",
    HIPHOP: "HIPHOP",
    RNB: "RNB",
    EDM: "EDM",
    JAZZ: "JAZZ",
    CLASSICAL: "CLASSICAL",
    LOFI: "LOFI",
    KPOP: "KPOP",
    VPOP: "VPOP",
    ACOUSTIC: "ACOUSTIC",
    INDIE: "INDIE",
    REMIX: "REMIX",
    OTHER: "OTHER"
}