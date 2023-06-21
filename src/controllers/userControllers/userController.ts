import { Request, Response } from "express"
import {
    PutOwnUserDto,
    PutUserDto,
    UserDto,
    UserLimitDto,
    UserName,
    UserTagname,
} from "../../dto/userDtos/userDto"
import BannerSizeExceededException from "../../errors/userErrors/BannerSizeExceededException"
import ImageSizeExceededException from "../../errors/userErrors/ImageSizeExceededException"
import UserEmailAlreadyExistException from "../../errors/userErrors/UserEmailAlreadyExistException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserTagAlreadyExistException from "../../errors/userErrors/UserTagAlreadyExistException"
import VideoSizeExceededException from "../../errors/userErrors/VideoSizeExceededException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    deleteUserById as deleteUserByIdService,
    getAllUsers as getAlluserService,
    getUserById as getUserByIdService,
    getUserByName as getUserByNameService,
    getUsersByTagname as getUsersByTagnameService,
    putUserBannerById as putUserBannerByIdService,
    putUserById as putUserByIdService,
    putUserImageById as putUserImageByIdService,
    putUser as putUserService,
    putUserVideoById as putUserVideoByIdService,
} from "../../services/userServices/userService"

//GET ALL USERS
export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getAlluserService()
        res.status(200).json({
            data: users,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET USER BY ID
export const getUserById = async (req: Request<UserDto>, res: Response) => {
    try {
        const body: UserDto = req.params
        const user = await getUserByIdService(body.id)
        res.status(200).json({
            data: user,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET USER BY Name
export const getUserByName = async (req: Request<UserName>, res: Response) => {
    console.log()

    try {
        const body: UserName = req.params
        const bodyLimit: UserLimitDto = req.body
        const user = await getUserByNameService(
            body.name,
            bodyLimit,
            req.headers.authorization
        )
        res.status(200).json({
            data: user,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET USERS BY TAGNAME
export const getUsersByTagname = async (
    req: Request<UserTagname>,
    res: Response
) => {
    try {
        const body: UserTagname = req.params
        const user = await getUsersByTagnameService(body.tag)
        res.status(200).json({
            data: user,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}
//PUT USER BY ID
export const putUserById = async (req: Request<UserDto>, res: Response) => {
    try {
        const params: UserDto = req.params
        const body: Partial<PutUserDto> = req.body

        await putUserByIdService(params.id, {
            ...body,
        })

        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT USER (MODIFICAR PROPIO USUARIO LOGUEADO)
export const putUser = async (req: Request, res: Response) => {
    try {
        const body: Partial<PutOwnUserDto> = req.body
        await putUserService(Number(req.params.userTokenId), body)

        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserEmailAlreadyExistException) {
            res.status(400).json({
                message: ResponseDictionary.EMAIL_ALREADY_EXIST,
            })
            return
        }
        if (error instanceof UserTagAlreadyExistException) {
            res.status(400).json({
                message: ResponseDictionary.TAG_ALREADY_EXIST,
            })
            return
        }
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT USER IMAGE
export const putUserImageById = async (req: Request, res: Response) => {
    try {
        const file = req.file
        if (file) {
            const image = {
                filename: String(file.originalname),
                buffer: file.buffer,
                size: file.size,
            }
            await putUserImageByIdService(
                { image },
                Number(req.params.userTokenId)
            )
        }

        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof ImageSizeExceededException) {
            res.status(400).json({
                message: ResponseDictionary.IMAGE_SIZE_EXCEEDED,
            })
            return
        }
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT USER BANNER
export const putUserBannerById = async (req: Request, res: Response) => {
    try {
        const file = req.file
        if (file) {
            const banner = {
                filename: String(file.originalname),
                buffer: file.buffer,
                size: file.size,
            }
            await putUserBannerByIdService(
                { banner },
                Number(req.params.userTokenId)
            )
        }

        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof BannerSizeExceededException) {
            res.status(400).json({
                message: ResponseDictionary.BANNER_SIZE_EXCEEDED,
            })
            return
        }

        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT USER VIDEO
export const putUserVideoById = async (req: Request, res: Response) => {
    try {
        const file = req.file
        if (file) {
            const video = {
                filename: String(file.originalname),
                buffer: file.buffer,
                size: file.size,
            }
            await putUserVideoByIdService(
                { video },
                Number(req.params.userTokenId)
            )
        }

        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof VideoSizeExceededException) {
            res.status(400).json({
                message: ResponseDictionary.VIDEO_SIZE_EXCEEDED,
            })
            return
        }

        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//DEL USER BY ID
export const deleteUserById = async (req: Request<UserDto>, res: Response) => {
    try {
        const params: UserDto = req.params

        await deleteUserByIdService(params.id)
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}
