export interface PutUserVideoDto {
    video: {
        filename: string
        buffer: Buffer
        size: number
    }
}

export interface PutUserVideoByIdRequestDto {
    video: File
}
export enum VideoTypes {
    mp4 = "mp4",
    mkv = "mkv",
    avi = "avi",
}
