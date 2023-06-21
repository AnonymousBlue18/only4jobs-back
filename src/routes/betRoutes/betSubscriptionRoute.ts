import { Router } from "express"
import {
    getAllBetSubscriptions,
    getAllMyBetSubscriptions,
    getBetSubscriptionById,
    postBetSubscription,
} from "../../controllers/betControllers/betSubscriptionController"
import { BetSubscriptionDto } from "../../dto/betDtos/betSubscriptionDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getBetSubscriptionByIdSchema from "../../schemas/betSchemas/subscriptionSchemas/getBetSubscriptionByIdSchema"
import postBetSubscriptionSchema from "../../schemas/betSchemas/subscriptionSchemas/postBetSubscriptionSchema"

const betSubscriptionRouter = Router()

//ROUTES

//POST BETSUBSCRIPTION (ROL USER LOGUEADO)
betSubscriptionRouter.post(
    "/subscriptions/bets",
    validatorBody(postBetSubscriptionSchema),
    authentication(),
    postBetSubscription
)

//GET BETSUBSCRIPTION BY ID (ROL USER LOGUEADO)
betSubscriptionRouter.get<any, BetSubscriptionDto>(
    "/subscriptions/bets/:id",
    validatorParams(getBetSubscriptionByIdSchema),
    authentication(),
    getBetSubscriptionById
)

//GET ALL MY BETSUBSCRIPTIONS (ROL USER LOGUEADO)
betSubscriptionRouter.get<any, BetSubscriptionDto>(
    "/subscriptions/mybets",
    authentication(),
    getAllMyBetSubscriptions
)

//GET ALL BETSUBSCRIPTIONS (ROL ADMIN)
betSubscriptionRouter.get(
    "/subscriptions/bets",
    authentication([ProfileEnum.ADMIN]),
    getAllBetSubscriptions
)

/* //GET ALL BETSUBSCRIPTIONS BY ID
betSubscriptionRouter.get<any, BetSubscriptionDto>(
    "/subscriptions/bets/user/:id",
    validatorParams(getBetSubscriptionByIdSchema),
    authentication(),
    getAllBetSubscriptionsById
) */

/* //PUT BETSUBSCRIPTION BY ID
betSubscriptionRouter.put<any, BetSubscriptionDto>(
    "/subscriptions/bets/:id",
    authentication(),
    validatorParams(getBetSubscriptionByIdSchema),
    validatorBody(putBetSubscriptionByIdSchema),
    putBetSubscriptionById
) */

/* //DEL BETSUBSCRIPTION BY ID
betSubscriptionRouter.delete<any, BetSubscriptionDto>(
    "/subscriptions/bets/:id",
    authentication(),
    validatorParams(getBetSubscriptionByIdSchema),
    deleteBetSubscriptionById
) */

export default betSubscriptionRouter
