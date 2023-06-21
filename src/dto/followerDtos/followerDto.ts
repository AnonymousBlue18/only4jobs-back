export interface FollowerParamsDto {
    id: number
    userTokenId: number
}

export interface FollowerUserTokenDto {
    userTokenId: string
}
export interface FollowerDto {
    followingId: number
}

export interface FollowerPageLimitDto {
    page: number
    limitPerPage: number
}
