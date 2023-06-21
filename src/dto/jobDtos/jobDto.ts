export interface JobParamsDto {
    id: number
    userTokenId: number
}

export interface JobUserTokenDto {
    userTokenId: string
}
export interface JobDto {
    titleJob: string
    timeJob: string
    category: string
    workplace: string
    typeJob: string
    publishDate: Date
    salary: number
    description: string
}

export interface JobStatusDto {
    status: string
}

export interface JobAllStatusDto {
    search: string
    orderBy: string
    range: Range
    category: string
    page: number
    limitPerPage: number
    status: string
}
export interface JobLatestDto {
    search: string
    orderBy: string
    range: Range
    category: string
    page: number
    limitPerPage: number
}

export interface JobPageDto {
    page: number
}
export interface Range {
    min: number
    max: number
}
