export interface PutUserImageDto {
    image: {
        filename: string
        buffer: Buffer
        size: number
    }
}

export interface PutUserImageByIdRequestDto {
    image: File
}

export enum ImageTypes {
    jpg = "jpg",
    png = "png",
    jpeg = "jpeg",
    webp = "webp",
}
