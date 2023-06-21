import { Router } from "express"
import {
    deleteWithdrawById,
    getAllWithdraws,
    getAllWithdrawsByUserId,
    getWithdrawById,
    getWithdrawsByBetId,
    getWithdrawsByUserId,
    postWithdraw,
    putWithdrawById,
    putWithdrawPayedById,
} from "../../controllers/withdrawControllers/withdrawController"
import { WithdrawDto } from "../../dto/withdrawDtos/withdrawDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getWithdrawByIdSchema from "../../schemas/WithdrawSchemas/getWithdrawByIdSchema"
import postWithdrawSchema from "../../schemas/WithdrawSchemas/postWithdrawSchema"
import putWithdrawByIdSchema from "../../schemas/WithdrawSchemas/putWithdrawByIdSchema"
import putWithdrawPayedByIdSchema from "../../schemas/WithdrawSchemas/putWithdrawPayedByIdSchema"

const withdrawRouter = Router()

//ROUTES

//GET ALL WITHDRAWS
withdrawRouter.get("/withdraws", authentication(), getAllWithdraws)

//GET WITHDRAW BY ID
withdrawRouter.get<any, WithdrawDto>(
    "/withdraws/:id",
    authentication(),
    validatorParams(getWithdrawByIdSchema),
    getWithdrawById
)

//GET WITHDRAWS BY BET ID
withdrawRouter.get<any, WithdrawDto>(
    "/withdraws/bet/:id",
    authentication(),
    validatorParams(getWithdrawByIdSchema),
    getWithdrawsByBetId
)

//GET WITHDRAW BY USER ID
withdrawRouter.get<any, WithdrawDto>(
    "/withdraws/user/:id",
    authentication(),
    validatorParams(getWithdrawByIdSchema),
    getWithdrawsByUserId
)

//GET ALL WITHDRASWS BY USER ID
withdrawRouter.get<any, WithdrawDto>(
    "/withdraws/user/all/:id",
    authentication(),
    validatorParams(getWithdrawByIdSchema),
    getAllWithdrawsByUserId
)

//PUT
withdrawRouter.put<any, WithdrawDto>(
    "/withdraws/:id",
    authentication(),
    validatorParams(getWithdrawByIdSchema),
    validatorBody(putWithdrawByIdSchema),
    putWithdrawById
)

//PUT ANSWER ADMIN
withdrawRouter.put<any, WithdrawDto>(
    "/withdraws/payed/:id",
    authentication([ProfileEnum.ADMIN]),
    validatorParams(getWithdrawByIdSchema),
    validatorBody(putWithdrawPayedByIdSchema),
    putWithdrawPayedById
)

//DEL
withdrawRouter.delete<any, WithdrawDto>(
    "/withdraws/:id",
    authentication(),
    validatorParams(getWithdrawByIdSchema),
    deleteWithdrawById
)
//POST
withdrawRouter.post(
    "/withdraws",
    authentication(),
    validatorBody(postWithdrawSchema),
    postWithdraw
)

export default withdrawRouter
