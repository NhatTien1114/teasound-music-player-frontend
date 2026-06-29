export type TUserProfileResponse = {
    authenticated: boolean;
    name?: string;
    email?: string;
    avatarUrl?: string;
    role?: string;
}

export type TAuthorResponse = {
    name?: string,
    bio?: string,
    avatar?: string
}