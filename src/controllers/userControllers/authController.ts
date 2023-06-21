import { Request, Response } from "express"
import LoginDto from "../../dto/userDtos/loginDto"
import RegisterDto from "../../dto/userDtos/registerDto"
import IncorrectPasswordException from "../../errors/userErrors/IncorrectPasswordException"
import UserEmailAlreadyExistException from "../../errors/userErrors/UserEmailAlreadyExistException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserTagAlreadyExistException from "../../errors/userErrors/UserTagAlreadyExistException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import {
    login as loginService,
    register as registerService,
} from "../../services/userServices/authService"

export const login = async (req: Request, res: Response) => {
    try {
        const data: LoginDto = req.body
        const { user, token } = await loginService(data)
        res.status(200).json({
            token,
            user,
        })
    } catch (error) {
        if (error instanceof IncorrectPasswordException) {
            res.status(400).json({
                message: ResponseDictionary.INCORRECT_PASSWORD,
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

export const register = async (req: Request, res: Response) => {
    try {
        const data: RegisterDto = req.body
        const user = await registerService(data)
        res.status(201).json({
            user: {
                tag: user.tag,
                name: user.name,
                lastname: user.lastname,
                email: user.email,
                profile: ProfileEnum[user.profileId],
            },
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
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
    }
}
