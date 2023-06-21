import { Request, Response } from "express"
import { PayDto, PayParamsDto, PayPayedDto } from "../../dto/payDtos/payDto"
import BetNotFoundException from "../../errors/betErrors/BetNotFoundException"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import PayNotFoundException from "../../errors/payErrors/PayNotFoundException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    deletePayById as deletePayByIdService,
    getAllPays as getAllPayService,
    getAllPaysByUserId as getAllPaysByUserIdService,
    getPayById as getPayByIdService,
    getPaysByBetId as getPaysByBetIdService,
    getPaysByUserId as getPaysByUserIdService,
    postPay as postPayService,
    putPayById as putPayByIdService,
    putPayPayedById as putPayPayedByIdService,
} from "../../services/payServices/payService"

//GET ALL PAYS
export const getAllPays = async (req: Request, res: Response) => {
    try {
        const pays = await getAllPayService()
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

//GET PAY BY ID
export const getPayById = async (req: Request<PayParamsDto>, res: Response) => {
    try {
        const body: PayParamsDto = req.params
        const pay = await getPayByIdService(body.id)
        res.status(200).json({
            data: pay,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET PAY BY BET ID
export const getPaysByBetId = async (
    req: Request<PayParamsDto>,
    res: Response
) => {
    try {
        const body: PayParamsDto = req.params
        const pay = await getPaysByBetIdService(body.id)
        res.status(200).json({
            data: pay,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
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

//GET PAY BY USER ID
export const getPaysByUserId = async (
    req: Request<PayParamsDto>,
    res: Response
) => {
    try {
        const body: PayParamsDto = req.params
        const pay = await getPaysByUserIdService(body.id)
        res.status(200).json({
            data: pay,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
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

//GET ALL PAYS BY USER ID
export const getAllPaysByUserId = async (
    req: Request<PayParamsDto>,
    res: Response
) => {
    try {
        const body: PayParamsDto = req.params
        const pay = await getAllPaysByUserIdService(body.id)
        res.status(200).json({
            data: pay,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
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

//PUT PAY BY ID
export const putPayById = async (req: Request<PayParamsDto>, res: Response) => {
    try {
        const params: PayParamsDto = req.params
        const body: Partial<PayDto> = req.body
        await putPayByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT PAY PAYED ADMIN
export const putPayPayedById = async (
    req: Request<PayParamsDto>,
    res: Response
) => {
    try {
        const params: PayParamsDto = req.params
        const body: PayPayedDto = req.body
        await putPayPayedByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//DEL PAY BY ID
export const deletePayById = async (
    req: Request<PayParamsDto>,
    res: Response
) => {
    try {
        const params: PayParamsDto = req.params

        await deletePayByIdService(params.id)
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof PayNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.PAY_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//POST PAY
export const postPay = async (req: Request, res: Response) => {
    try {
        const body: PayDto = req.body
        await postPayService(body)
        res.status(201).json({
            message: ResponseDictionary.CREATED,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserSameIdException) {
            res.status(400).json({
                message: ResponseDictionary.USER_SAME_ID,
            })
            return
        }
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
