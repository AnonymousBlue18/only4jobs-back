export interface WithdrawParamsDto {
    id: number
}
export interface WithdrawDto {
    betId: number
    winnerId: number
    date: Date
    title: string
}
export interface WithdrawPayedDto {
    payed: boolean
}
