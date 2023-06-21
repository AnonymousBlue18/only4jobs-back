import fs from "fs/promises"
import path from "path"
import sharp from "sharp"

export enum MultimediaType {
    Image = 1,
    Video = 2,
    Banner = 3,
}

const assetsPaths: { [type in MultimediaType]: string } = {
    "1": "images",
    "2": "videos",
    "3": "banners",
}

export const uploadFile = async (
    name: string,
    buffer: Buffer,
    type: MultimediaType
) => {
    const time = new Date().getTime()
    const extension = path.extname(name).toLowerCase()
    const namefile = `${time}${name}`
    const pathfinal = path.join(
        __dirname,
        "..",
        "..",
        "assets",
        assetsPaths[type],
        namefile
    )

    if (extension === ".mp4" || extension === ".mov") {
        await fs.writeFile(pathfinal, buffer)
    } else {
        
        if(type === 1) {
            await sharp(buffer)
                .rotate()
                .resize(350, 350)
                .toFormat("webp")
                .toFile(pathfinal);
        } else {
             await sharp(buffer)
                .rotate()
                .toFormat("webp")
                .toFile(pathfinal);
        }
    }

    return `${assetsPaths[type]}/${namefile}`
}
