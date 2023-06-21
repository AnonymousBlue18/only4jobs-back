export interface BetParamsDto {
    id: number
    userTokenId: string
}
export interface BetUserTokenDto {
    userTokenId: string
}
export interface BetDto {
    title: string
    category: string
    description: string
    endDate: Date
    price: number
    question: string
    prediction: boolean
}
export interface BetAnswerDto {
    answer: boolean
}

export interface BetStatusDto {
    status: string
}

export interface BetAllStatusDto {
    search: string
    orderBy: string
    range: Range
    category: string
    page: number
    limitPerPage: number
    status: string
}

export interface BetLatestDto {
    search: string
    orderBy: string
    range: Range
    category: string
    page: number
    limitPerPage: number
}
export interface BetPageDto {
    page: number
}

export interface Range {
    min: number
    max: number
}
