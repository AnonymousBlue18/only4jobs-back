import { Request, Response } from "express"
import {
    BetAllStatusDto,
    BetAnswerDto,
    BetDto,
    BetLatestDto,
    BetPageDto,
    BetParamsDto,
    BetStatusDto,
    BetUserTokenDto,
} from "../../dto/betDtos/betDto"
import BetNotFoundException from "../../errors/betErrors/BetNotFoundException"
import CannotDeleteBetException from "../../errors/betErrors/CannotDeleteBetException"
import CannotDeleteOthersBetException from "../../errors/betErrors/CannotDeleteOthersBetException"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    deleteBetById as deleteBetByIdService,
    getAllBetsByUserId as getAllBetsByUserIdService,
    getAllMyBets as getAllMyBetsService,
    getBetById as getBetByIdService,
    postAllBets as postAllBetService,
    postAllLatestBets as postAllLatestBetsService,
    postBet as postBetService,
    putBetAnswerById as putBetAnswerByIdService,
    putBetStatusById as putBetStatusByIdService,
} from "../../services/betServices/betService"

//POST BET
export const postBet = async (req: Request, res: Response) => {
    try {
        const body: BetDto = req.body
        await postBetService(body, Number(req.params.userTokenId))
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

//POST ALL BETS (ROL ADMIN)
export const postAllBets = async (req: Request, res: Response) => {
    try {
        const body: BetAllStatusDto = req.body
        const bets = await postAllBetService(body)
        res.status(200).json({
            data: bets,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//POST ALL LATEST BETS (NO NECESITAN ROL)
export const postAllLatestBets = async (req: Request, res: Response) => {
    try {
        const body: BetLatestDto = req.body
        const bets = await postAllLatestBetsService(
            body,
            req.headers.authorization
        )
        res.status(200).json({
            data: bets,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET ALLS MY BETS
export const getAllMyBets = async (
    req: Request<BetUserTokenDto>,
    res: Response
) => {
    try {
        const params: BetUserTokenDto = req.params
        const bodyPage: BetPageDto = req.body

        const bet = await getAllMyBetsService(
            bodyPage,
            Number(params?.userTokenId)
        )
        res.status(200).json({
            data: bet,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof BetNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_NOT_FOUND,
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

//GET BET BY ID (NO NECESITAN ROL)
export const getBetById = async (req: Request<BetParamsDto>, res: Response) => {
    try {
        const params: BetParamsDto = req.params
        const bet = await getBetByIdService(
            params.id,
            Number(params?.userTokenId)
        )
        res.status(200).json({
            data: bet,
        })
    } catch (error) {
        console.error(error)
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

//GET ALL BETS BY USER ID (NO NECESITAN ROL)
export const getAllBetsByUserId = async (
    req: Request<BetParamsDto>,
    res: Response
) => {
    try {
        const body: BetParamsDto = req.params
        const bodyPage: BetPageDto = req.body
        const bet = await getAllBetsByUserIdService(body.id, bodyPage)
        res.status(200).json({
            data: bet,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof BetNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.BET_NOT_FOUND,
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

/* //PUT BET BY ID
export const putBetById = async (req: Request<BetParamsDto>, res: Response) => {
    try {
        const params: BetParamsDto = req.params
        const body: Partial<BetDto> = req.body
        await putBetByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
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
} */

//PUT DECIDE BET BY ID (ROL ADMIN)
export const putBetAnswerById = async (
    req: Request<BetParamsDto>,
    res: Response
) => {
    try {
        const params: BetParamsDto = req.params
        const body: BetAnswerDto = req.body
        await putBetAnswerByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
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

//PUT BET STATUS BY ID (ROL ADMIN)
export const putBetStatusById = async (
    req: Request<BetParamsDto>,
    res: Response
) => {
    try {
        const params: BetParamsDto = req.params
        const body: BetStatusDto = req.body
        await putBetStatusByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
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

//DEL BET BY ID
export const deleteBetById = async (
    req: Request<BetParamsDto>,
    res: Response
) => {
    try {
        const params: BetParamsDto = req.params
        await deleteBetByIdService(params.id, Number(params?.userTokenId))
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof CannotDeleteBetException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_DELETE_BET,
            })
            return
        }

        if (error instanceof CannotDeleteOthersBetException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_DELETE_OTHERS_BET,
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
