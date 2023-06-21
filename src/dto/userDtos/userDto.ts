export interface UserDto {
    id: number
    userTokenId: string
}
export interface UserTokenDto {
    userTokenId: string
}
export interface UserName {
    name: string
}
export interface UserTagname {
    tag: string
}

export interface UserLimitDto {
    page: number
}
export interface PutUserDto {
    tag: string
    name: string
    lastname: string
    dateOfBirth: Date
    phone: string
    country: string
    studies: string
    laboralExperience: string
    email: string
}

export interface PutOwnUserDto {
    tag: string
    name: string
    lastname: string
    dateOfBirth: Date
    phone: string
    country: string
    studies: string
    laboralExperience: string
    email: string
}
