import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import config from "../../config"
import LoginDto from "../../dto/userDtos/loginDto"
import RegisterDto from "../../dto/userDtos/registerDto"
import IncorrectPasswordException from "../../errors/userErrors/IncorrectPasswordException"
import UserEmailAlreadyExistException from "../../errors/userErrors/UserEmailAlreadyExistException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserTagAlreadyExistException from "../../errors/userErrors/UserTagAlreadyExistException"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import Follower from "../../models/followerModel/Follower"
import User from "../../models/userModels/User"
import { parseFile } from "../../utils/useFile"

export const register = async (body: RegisterDto) => {
    const encryptPassword = await bcrypt.hash(body.password, config.HASH)
    // Validar si el email ya existe
    const userEmail = await User.findOne({
        where: { email: body.email },
    })

    if (userEmail) {
        throw new UserEmailAlreadyExistException()
    }

    // Validar si el tag ya existe
    const userTag = await User.findOne({
        where: { tag: body.tag },
    })

    if (userTag) {
        throw new UserTagAlreadyExistException()
    }
    const user = await User.create({
        ...body,
        password: encryptPassword,
        profileId: ProfileEnum.USER,
    })

    return user
}

export const login = async (body: LoginDto) => {
    const user = await User.findOne({
        where: { email: body.email },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
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

    const validatePassword = await bcrypt.compare(body.password, user.password)
    if (!validatePassword) {
        throw new IncorrectPasswordException()
    }

    const token = jwt.sign(
        {
            id: user.id,
        },
        config.KEY
    )

    // Obtenemos el conteo de seguidores y seguidos del usuario
    const followersCount = await Follower.count({
        where: { followingId: user.id },
    })
    const followingCount = await Follower.count({
        where: { followerId: user.id },
    })

    return {
        user: {
            ...parsedUser,
            password: undefined,
            followersCount,
            followingCount,
        },
        token,
    }
}
