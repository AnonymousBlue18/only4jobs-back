import { Router } from "express"
import {
    deleteBetById,
    getAllBetsByUserId,
    getAllMyBets,
    getBetById,
    postAllBets,
    postAllLatestBets,
    postBet,
    putBetAnswerById,
    putBetStatusById,
} from "../../controllers/betControllers/betController"
import { BetDto } from "../../dto/betDtos/betDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getBetPageSchema from "../../schemas/betSchemas/getBetPageSchema"
import postBetAllStatusSchema from "../../schemas/betSchemas/postBetAllStatusSchema"
import postBetLatestSchema from "../../schemas/betSchemas/postBetLatestSchema"
import postBetSchema from "../../schemas/betSchemas/postBetSchema"
import putBetAnswerByIdSchema from "../../schemas/betSchemas/putBetAnswerByIdSchema"
import putBetStatusByIdSchema from "../../schemas/betSchemas/putBetStatusByIdSchema"
import getBetByIdSchema from "../../schemas/userSchemas/getUserByIdSchema"

const betRouter = Router()

//ROUTES

//POST BET
betRouter.post("/bets", validatorBody(postBetSchema), authentication(), postBet)

//POST ALL BETS (ROL ADMIN)
betRouter.post(
    "/bets/all",
    validatorBody(postBetAllStatusSchema),
    authentication([ProfileEnum.ADMIN]),
    postAllBets
)

//POST ALL LASTEST BETS (NO NECESITAN ROL)
betRouter.post(
    "/bets/latest",
    validatorBody(postBetLatestSchema),
    postAllLatestBets
)

//GET ALL MY BETS
betRouter.get<any, BetDto>(
    "/bets/my/bets",
    validatorBody(getBetPageSchema),
    authentication(),
    getAllMyBets
)

//GET BET BY ID (NO NECESITAN ROL)
betRouter.get<any, BetDto>(
    "/bets/:id",
    validatorParams(getBetByIdSchema),
    authentication(),
    getBetById
)

//GET ALL BETS BY USER ID (NO NECESITAN ROL)
betRouter.get<any, BetDto>(
    "/bets/user/all/:id",
    validatorParams(getBetByIdSchema),
    validatorBody(getBetPageSchema),
    authentication(),
    getAllBetsByUserId
)

/* //PUT BET BY ID
betRouter.put<any, BetDto>(
    "/bets/:id",
    validatorParams(getBetByIdSchema),
    validatorBody(putBetByIdSchema),
    authentication(),
    putBetById
) */

//PUT DECIDE BET BY ID (ROL ADMIN)
betRouter.put<any, BetDto>(
    "/bets/answer/:id",
    validatorParams(getBetByIdSchema),
    validatorBody(putBetAnswerByIdSchema),
    authentication([ProfileEnum.ADMIN]),
    putBetAnswerById
)

//PUT BET STATUS BY ID (ROL ADMIN)
betRouter.put<any, BetDto>(
    "/bets/status/:id",
    validatorParams(getBetByIdSchema),
    validatorBody(putBetStatusByIdSchema),
    authentication([ProfileEnum.ADMIN]),
    putBetStatusById
)

//DEL BET BY ID
betRouter.delete<any, BetDto>(
    "/bets/:id",
    validatorParams(getBetByIdSchema),
    authentication(),
    deleteBetById
)

export default betRouter
