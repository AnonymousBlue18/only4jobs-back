import fs from "fs"
import path from "path"
import { Op } from "sequelize"
import { PutUserBannerDto } from "../../dto/userDtos/userBannerDto"
import {
    PutOwnUserDto,
    PutUserDto,
    UserLimitDto,
} from "../../dto/userDtos/userDto"
import { PutUserImageDto } from "../../dto/userDtos/userImageDto"
import { PutUserVideoDto } from "../../dto/userDtos/userVideoDto"
import BannerSizeExceededException from "../../errors/userErrors/BannerSizeExceededException"
import ImageSizeExceededException from "../../errors/userErrors/ImageSizeExceededException"
import UserEmailAlreadyExistException from "../../errors/userErrors/UserEmailAlreadyExistException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserTagAlreadyExistException from "../../errors/userErrors/UserTagAlreadyExistException"
import VideoSizeExceededException from "../../errors/userErrors/VideoSizeExceededException"
import Follower from "../../models/followerModel/Follower"
import User from "../../models/userModels/User"
import { parseFile } from "../../utils/useFile"
import { parseToken } from "../../utils/useToken"
import {
    MultimediaType,
    uploadFile,
} from "../multimediaServices/mutlimediaService"

//GET ALL USERS
export const getAllUsers = async () => {
    const users = await User.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
    })
    const parsedUsers = users.map(item => ({
        ...item.toJSON(),
        image: item.image ? parseFile(item.image) : item.image,
        banner: item.banner ? parseFile(item.banner) : item.banner,
        video: item.video ? parseFile(item.video) : item.video,
    }))
    return parsedUsers
}

//GET USER BY ID
export const getUserById = async (id: number) => {
    const user = await User.findOne({
        where: { id: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "password"],
        },
    })

    if (!user) {
        throw new UserNotFoundException()
    }
    const parsedUser = {
        ...user.toJSON(),
        image: user.image ? parseFile(user.image) : user.image,
        banner: user.banner ? parseFile(user.banner) : user.banner,
        video: user.video ? parseFile(user.video) : user.video,
    }

    // Obtenemos el conteo de seguidores y seguidos del usuario
    const followersCount = await Follower.count({
        where: { followingId: user.id },
    })
    const followingCount = await Follower.count({
        where: { followerId: user.id },
    })

    return { parsedUser, followersCount, followingCount }
}

//GET USERS BY NAME
export const getUserByName = async (
    name: string,
    body: Partial<UserLimitDto>,
    token: string | undefined
) => {
    const filters: any = {
        page: body?.page ?? 1,
    }

    const page = parseInt(filters.page || "1")
    const limit = 5
    const offset = (page - 1) * limit

    const searchConditions: any = {
        name: name,
    }

    let payload = null

    if (token) {
        payload = parseToken(token)
    }

    if (payload) {
        searchConditions.id = { [Op.ne]: payload.id }
    }

    const totalCount = await User.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const users = await User.findAll({
        where: searchConditions,
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "lastname",
                "dateOfBirth",
                "phone",
                "country",
                "studies",
                "laboralExperience",
                "email",
                "password",
                "banner",
                "video",
                "profileId",
            ],
        },
        limit: limit,
        offset: offset,
    })
    if (!users) {
        throw new UserNotFoundException()
    }

    const parsedUsers = users.map(item => ({
        ...item.toJSON(),
        image: item.image ? parseFile(item.image) : item.image,
        banner: item.banner ? parseFile(item.banner) : item.banner,
        video: item.video ? parseFile(item.video) : item.video,
    }))

    return { users: parsedUsers, page, totalPages, totalCount }
}

//GET USERS BY TAGNAME
export const getUsersByTagname = async (tagname: string) => {
    const user: any = await User.findOne({
        where: { tag: tagname },
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "profileId",
                "password",
            ],
        },
    })

    if (!user) {
        throw new UserNotFoundException()
    }
    const parsedUser = {
        ...user.toJSON(),
        image: user.image ? parseFile(user.image) : user.image,
        banner: user.banner ? parseFile(user.banner) : user.banner,
        video: user.video ? parseFile(user.video) : user.video,
    }

    // Obtenemos el conteo de seguidores y seguidos del usuario
    const followersCount = await Follower.count({
        where: { followingId: user.id },
    })
    const followingCount = await Follower.count({
        where: { followerId: user.id },
    })

    return { parsedUser, followersCount, followingCount }
}

//PUT USER BY ID
export const putUserById = async (id: number, body: Partial<PutUserDto>) => {
    const user = await User.update(body, { where: { id: id } })
    if (user[0] <= 0) {
        throw new UserNotFoundException()
    }
}

//PUT USER (MODIFICAR PROPIO USUARIO LOGUEADO)
export const putUser = async (userId: number, body: Partial<PutOwnUserDto>) => {
    // Validar si el email ya existe
    if (body.email) {
        const existingUserWithEmail = await User.findOne({
            where: { email: body.email },
        })
        if (existingUserWithEmail && existingUserWithEmail.id !== userId) {
            throw new UserEmailAlreadyExistException()
        }
    }

    // Validar si el tag ya existe
    if (body.tag) {
        const existingUserWithTag = await User.findOne({
            where: { tag: body.tag },
        })
        if (existingUserWithTag && existingUserWithTag.id !== userId) {
            throw new UserTagAlreadyExistException()
        }
    }
    const user = await User.update(body, { where: { id: userId } })
    if (user[0] <= 0) {
        throw new UserNotFoundException()
    }
}

//PUT USER IMAGE
export const putUserImageById = async (
    body: PutUserImageDto,
    userId: number
) => {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
        throw new UserNotFoundException()
    }

    // Verificar tamaño de la imagen
    const maxSize = 8 * 1024 * 1024 // 8 MB en bytes
    if (body.image.size > maxSize) {
        throw new ImageSizeExceededException()
    }

    //ramdon
    const randomString = "pf" + Math.floor(Math.random() * 1000000000) + ".webp"
    //const extension = path.extname(body.image.filename)
    const newImageName = `${randomString}`

    // Subir la nueva imagen y obtener su URI
    const newImageURI = await uploadFile(
        newImageName,
        body.image.buffer,
        MultimediaType.Image
    )
    // Eliminar la imagen anterior si existe
    const paths = user.image ? user.image.split("/") : ""
    const currentImage = paths !== "" ? paths[paths.length - 1] : null
    if (
        user.image &&
        currentImage &&
        fs.existsSync(
            path.join(__dirname, "..", "..", "assets", "images", currentImage)
        )
    ) {
        fs.unlinkSync(
            path.join(__dirname, "..", "..", "assets", "images", currentImage)
        )
    }

    // Actualizar el modelo de usuario con la nueva imagen
    await user.update({
        image: newImageURI,
    })
}

//PUT USER BANNER
export const putUserBannerById = async (
    body: PutUserBannerDto,
    userId: number
) => {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
        throw new UserNotFoundException()
    }

    // Verificar tamaño del banner
    const maxSize = 8 * 1024 * 1024 // 8 MB en bytes
    if (body.banner.size > maxSize) {
        throw new BannerSizeExceededException()
    }

    //ramdon
    const randomString = "pf" + Math.floor(Math.random() * 1000000000) + ".webp"
    //const extension = path.extname(body.banner.filename)
    const newBannerName = `${randomString}`

    // Subir el nuevo banner y obtener su URI
    const newBannerURI = await uploadFile(
        newBannerName,
        body.banner.buffer,
        MultimediaType.Banner
    )
    // Eliminar el banner anterior si existe
    const paths = user.banner ? user.banner.split("/") : ""
    const currentBanner = paths !== "" ? paths[paths.length - 1] : null
    if (
        user.banner &&
        currentBanner &&
        fs.existsSync(
            path.join(__dirname, "..", "..", "assets", "banners", currentBanner)
        )
    ) {
        fs.unlinkSync(
            path.join(__dirname, "..", "..", "assets", "banners", currentBanner)
        )
    }

    // Actualizar el modelo de usuario con el nuevo banner
    await user.update({
        banner: newBannerURI,
    })
}

//PUT USER VIDEO
export const putUserVideoById = async (
    body: PutUserVideoDto,
    userId: number
) => {
    const user = await User.findOne({ where: { id: userId } })
    if (!user) {
        throw new UserNotFoundException()
    }

    const maxVideoSize = 100 * 1024 * 1024 // 100 MB en bytes
    if (body.video.size > maxVideoSize) {
        throw new VideoSizeExceededException()
    }

    //ramdon
    const randomString = "pf" + Math.floor(Math.random() * 1000000000)
    const extension = path.extname(body.video.filename)
    const newVideoName = `${randomString}${extension}`

    // Subir el nuevo video y obtener su URI
    const newVideoURI = await uploadFile(
        newVideoName,
        body.video.buffer,
        MultimediaType.Video
    )
    // Eliminar el video anterior si existe
    const paths = user.video ? user.video.split("/") : ""
    const currentVideo = paths !== "" ? paths[paths.length - 1] : null
    if (
        user.video &&
        currentVideo &&
        fs.existsSync(
            path.join(__dirname, "..", "..", "assets", "videos", currentVideo)
        )
    ) {
        fs.unlinkSync(
            path.join(__dirname, "..", "..", "assets", "videos", currentVideo)
        )
    }

    // Actualizar el modelo de usuario con el nuevo video
    await user.update({
        video: newVideoURI,
    })
}

//DEL USER BY ID
export const deleteUserById = async (id: number) => {
    const user = await User.destroy({ where: { id: id } })
    if (user <= 0) {
        throw new UserNotFoundException()
    }
}
