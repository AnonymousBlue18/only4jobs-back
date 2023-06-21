import { Request, Response } from "express"
import {
    WithdrawDto,
    WithdrawParamsDto,
    WithdrawPayedDto,
} from "../../dto/withdrawDtos/withdrawDto"
import BetNotFoundException from "../../errors/betErrors/BetNotFoundException"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import WithdrawNotFoundException from "../../errors/withdrawErrors/WithdrawNotFoundException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    deleteWithdrawById as deleteWithdrawByIdService,
    getAllWithdrawsByUserId as getAllWithdrawsByUserIdService,
    getAllWithdraws as getAllWithdrawsService,
    getWithdrawById as getWithdrawByIdService,
    getWithdrawsByBetId as getWithdrawsByBetIdService,
    getWithdrawsByUserId as getWithdrawsByUserIdService,
    postWithdraw as postWithdrawService,
    putWithdrawById as putWithdrawByIdService,
    putWithdrawPayedById as putWithdrawPayedByIdService,
} from "../../services/withdrawServices/withdrawService"

//GET ALL WITHDRAWS
export const getAllWithdraws = async (req: Request, res: Response) => {
    try {
        const pays = await getAllWithdrawsService()
        res.status(200).json({
            data: pays,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET WITHDRAW BY ID
export const getWithdrawById = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const body: WithdrawParamsDto = req.params
        const withdraw = await getWithdrawByIdService(body.id)
        res.status(200).json({
            data: withdraw,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET WITHDRAW BY BET ID
export const getWithdrawsByBetId = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const body: WithdrawParamsDto = req.params
        const Withdraw = await getWithdrawsByBetIdService(body.id)
        res.status(200).json({
            data: Withdraw,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
            })
            return
        }
        if (error instanceof BetNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET WITHDRAW BY USER ID
export const getWithdrawsByUserId = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const body: WithdrawParamsDto = req.params
        const withdraw = await getWithdrawsByUserIdService(body.id)
        res.status(200).json({
            data: withdraw,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
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

//GET ALL WITHDRAWS BY USER ID
export const getAllWithdrawsByUserId = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const body: WithdrawParamsDto = req.params
        const withdraw = await getAllWithdrawsByUserIdService(body.id)
        res.status(200).json({
            data: withdraw,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
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

//PUT WITHDRAW BY ID
export const putWithdrawById = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const params: WithdrawParamsDto = req.params
        const body: Partial<WithdrawDto> = req.body
        await putWithdrawByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT WITHDRAW PAYED ADMIN
export const putWithdrawPayedById = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const params: WithdrawParamsDto = req.params
        const body: WithdrawPayedDto = req.body
        await putWithdrawPayedByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//DEL WITHDRAW BY ID
export const deleteWithdrawById = async (
    req: Request<WithdrawParamsDto>,
    res: Response
) => {
    try {
        const params: WithdrawParamsDto = req.params

        await deleteWithdrawByIdService(params.id)
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof WithdrawNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.WITHDRAW_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//POST WITHDRAW
export const postWithdraw = async (req: Request, res: Response) => {
    try {
        const body: WithdrawDto = req.body
        await postWithdrawService(body)
        res.status(201).json({
            message: ResponseDictionary.CREATED,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof CannotCreateException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_CREATE,
            })
            return
        }
        if (error instanceof BetNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}
