import { Request, Response } from "express"
import {
    BetSubscriptionDto,
    BetSubscriptionParamsDto,
} from "../../dto/betDtos/betSubscriptionDto"
import BetNotAvailbleException from "../../errors/betErrors/BetNotAvailbleException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"

import { BetUserTokenDto } from "src/dto/betDtos/betDto"
import BetSubscriptionNotFoundException from "../../errors/betErrors/BetSubscriptionNotFoundException"
import VoteCannotCreateException from "../../errors/cannotErrors/VoteCannotCreateException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import {
    getAllBetSubscriptions as getAllBetSubscriptionService,
    getAllMyBetSubscriptions as getAllMyBetSubscriptionsService,
    getBetSubscriptionById as getBetSubscriptionByIdService,
    postBetSubscription as postBetSubscriptionService,
} from "../../services/betServices/betSubscriptionService"

//POST BETSUBSCRIPTION (ROL USER LOGUEADO)
export const postBetSubscription = async (req: Request, res: Response) => {
    try {
        const params: BetUserTokenDto = req.params as any
        const body: BetSubscriptionDto = req.body

        await postBetSubscriptionService(body, Number(params.userTokenId))
        res.status(201).json({
            message: ResponseDictionary.CREATED,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof UserNotFoundException) {
            res.status(400).json({
                message: ResponseDictionary.USER_NOT_FOUND,
            })
            return
        }
        if (error instanceof UserSameIdException) {
            res.status(400).json({
                message: ResponseDictionary.USER_SAME_ID,
            })
            return
        }
        if (error instanceof BetNotAvailbleException) {
            res.status(404).json({
                message: ResponseDictionary.BET_NOT_AVAILBLE,
            })
            return
        }

        if (error instanceof VoteCannotCreateException) {
            res.status(500).json({
                message: ResponseDictionary.VOTE_CANNOT_CREATE,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET BETSUBSCRIPTION BY ID (ROL USER LOGUEADO)
export const getBetSubscriptionById = async (
    req: Request<BetSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: BetSubscriptionParamsDto = req.params
        const betSubscription = await getBetSubscriptionByIdService(
            params.id,
            Number(params.userTokenId)
        )
        res.status(200).json({
            data: betSubscription,
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

//GET ALL MY BETSUBSCRIPTIONS (ROL USER LOGUEADO)
export const getAllMyBetSubscriptions = async (
    req: Request<BetSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: BetSubscriptionParamsDto = req.params
        const betSubscriptions = await getAllMyBetSubscriptionsService(
            Number(params.userTokenId)
        )
        res.status(200).json({
            data: betSubscriptions,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof BetSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET ALL BETSUBSCRIPTIONS (ROL ADMIN)
export const getAllBetSubscriptions = async (req: Request, res: Response) => {
    try {
        const betSubscriptions = await getAllBetSubscriptionService()
        res.status(200).json({
            data: betSubscriptions,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

/* //GET ALL BETSUBSCRIPTIONS BY ID
export const getAllBetSubscriptionsById = async (
    req: Request<BetSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const body: BetSubscriptionParamsDto = req.params
        const bet = await getAllBetSubscriptionByIdService(body.id)
        res.status(200).json({
            data: bet,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof BetSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
} */

/* //PUT BETSUBSCRIPTION BY ID
export const putBetSubscriptionById = async (
    req: Request<BetSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: BetSubscriptionParamsDto = req.params
        const body: Partial<BetSubscriptionDto> = req.body
        await putBetSubscriptionByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof BetSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
} */

/* //DEL BETSUBSCRIPTION BY ID
export const deleteBetSubscriptionById = async (
    req: Request<BetSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: BetSubscriptionParamsDto = req.params

        await deleteBetSubscriptionByIdService(params.id)
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof BetSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
} */
