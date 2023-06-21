export interface PutUserBannerDto {
    banner: {
        filename: string
        buffer: Buffer
        size: number
    }
}

export interface PutUserBannerByIdRequestDto {
    banner: File
}

export enum ImageTypes {
    jpg = "jpg",
    png = "png",
    jpeg = "jpeg",
    webp = "webp",
}
