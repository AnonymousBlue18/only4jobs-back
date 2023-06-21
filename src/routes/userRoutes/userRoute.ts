import { Router } from "express"
import multer from "multer"
import {
    deleteUserById,
    getAllUsers,
    getUserById,
    getUserByName,
    getUsersByTagname,
    putUser,
    putUserBannerById,
    putUserById,
    putUserImageById,
    putUserVideoById,
} from "../../controllers/userControllers/userController"
import { UserDto, UserName } from "../../dto/userDtos/userDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getUserByIdSchema from "../../schemas/userSchemas/getUserByIdSchema"
import getUserByNameSchema from "../../schemas/userSchemas/getUserByNameSchema"
import getUserByTagnameSchema from "../../schemas/userSchemas/getUserByTagnameSchema"
import getUserLimitSchema from "../../schemas/userSchemas/getUserLimitSchema"
import putUserBannerByIdSchema from "../../schemas/userSchemas/putUserBannerByIdSchema"
import putUserByIdSchema from "../../schemas/userSchemas/putUserByIdSchema"
import putUserImageByIdSchema from "../../schemas/userSchemas/putUserImageByIdSchema"
import putUserSchema from "../../schemas/userSchemas/putUserSchema"
import putUserVideoByIdSchema from "../../schemas/userSchemas/putUserVideoByIdSchema"
const upload = multer({ storage: multer.memoryStorage() })

const userRouter = Router()

//ROUTES

//GET ALL USERS (FOLDER ADMIN)
userRouter.get("/users", authentication([ProfileEnum.ADMIN]), getAllUsers)

//GET USER BY ID
userRouter.get<any, UserDto>(
    "/users/:id",
    validatorParams(getUserByIdSchema),
    getUserById
)

//GET USER BY NAME
userRouter.get<any, UserName>(
    "/users/name/:name",
    validatorParams(getUserByNameSchema),
    validatorBody(getUserLimitSchema),
    getUserByName
)

//GET USERS BY TAGNAME
userRouter.get<any, UserDto>(
    "/users/tagname/:tag",
    validatorParams(getUserByTagnameSchema),
    getUsersByTagname
)

//PUT USER BY ID (FOLDER ADMIN)
userRouter.put<any, UserDto>(
    "/users/:id",
    authentication([ProfileEnum.ADMIN]),
    validatorParams(getUserByIdSchema),
    validatorBody(putUserByIdSchema),
    putUserById
)

//PUT USER (MODIFICAR PROPIO USUARIO LOGUEADO)
userRouter.put(
    "/users/own/user",
    validatorBody(putUserSchema),
    authentication(),
    putUser
)

//PUT USER IMAGE
userRouter.put(
    "/users/upload/image",
    authentication(),
    validatorBody(putUserImageByIdSchema),
    upload.single("image"),
    putUserImageById
)

//PUT USER BANNER
userRouter.put(
    "/users/upload/banner",
    authentication(),
    validatorBody(putUserBannerByIdSchema),
    upload.single("banner"),
    putUserBannerById
)

//PUT USER VIDEO
userRouter.put(
    "/users/upload/video",
    authentication(),
    validatorBody(putUserVideoByIdSchema),
    upload.single("video"),
    putUserVideoById
)

//DEL USER BY ID (FOLDER ADMIN)
userRouter.delete<any, UserDto>(
    "/users/:id",
    authentication([ProfileEnum.ADMIN]),
    validatorParams(getUserByIdSchema),
    deleteUserById
)

export default userRouter
