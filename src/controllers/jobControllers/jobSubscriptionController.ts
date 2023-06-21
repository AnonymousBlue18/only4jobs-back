import { Request, Response } from "express"
import { JobUserTokenDto } from "../../dto/jobDtos/jobDto"
import {
    JobSubscriptionDto,
    JobSubscriptionParamsDto,
} from "../../dto/jobDtos/jobSubscriptionDto"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import JobNotAvailbleException from "../../errors/jobErrors/JobNotAvailbleException"
import JobSubscriptionNotFoundException from "../../errors/jobErrors/JobSubscriptionNotFoundException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    getAllJobSubscriptions as getAllJobSubscriptionService,
    getAllMyJobSubscriptions as getAllMyJobSubscriptionsService,
    getJobSubscriptionById as getJobSubscriptionByIdService,
    postJobSubscription as postJobSubscriptionService,
} from "../../services/jobServices/jobSubscriptionService"

//POST JOBSUBSCRIPTION (ROL USER LOGUEADO)
export const postJobSubscription = async (req: Request, res: Response) => {
    try {
        const params: JobUserTokenDto = req.params as any
        const body: JobSubscriptionDto = req.body

        await postJobSubscriptionService(body, Number(params.userTokenId))
        res.status(201).json({
            message: ResponseDictionary.CREATED,
        })
    } catch (error) {
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

        if (error instanceof JobNotAvailbleException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_AVAILBLE,
            })
            return
        }

        if (error instanceof CannotCreateException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_CREATE,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET JOBSUBSCRIPTION BY ID (ROL USER LOGUEADO)
export const getJobSubscriptionById = async (
    req: Request<JobSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: JobSubscriptionParamsDto = req.params

        const jobSubscription = await getJobSubscriptionByIdService(
            params.id,
            Number(params.userTokenId)
        )
        res.status(200).json({
            data: jobSubscription,
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

//GET ALL MY JOBSUBSCRIPTIONS (ROL USER LOGUEADO)
export const getAllMyJobSubscriptions = async (
    req: Request<JobSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: JobSubscriptionParamsDto = req.params
        const jobSubscriptions = await getAllMyJobSubscriptionsService(
            Number(params.userTokenId)
        )
        res.status(200).json({
            data: jobSubscriptions,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET ALL JOBSUBSCRIPTIONS (ROL ADMIN)
export const getAllJobSubscriptions = async (req: Request, res: Response) => {
    try {
        const jobSubscriptions = await getAllJobSubscriptionService()
        res.status(200).json({
            data: jobSubscriptions,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

/* //GET ALL JOBSUBSCRIPTIONS BY ID
export const getAllJobSubscriptionsById = async (
    req: Request<JobSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const body: JobSubscriptionParamsDto = req.params
        const job = await getAllJobSubscriptionByIdService(body.id)
        res.status(200).json({
            data: job,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
} */

/* //PUT JOBSUBSCRIPTION BY ID
export const putJobSubscriptionById = async (
    req: Request<JobSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: JobSubscriptionParamsDto = req.params
        const body: Partial<JobSubscriptionDto> = req.body
        await putJobSubscriptionByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
} */

/* //DEL JOBSUBSCRIPTION BY ID
export const deleteJobSubscriptionById = async (
    req: Request<JobSubscriptionParamsDto>,
    res: Response
) => {
    try {
        const params: JobSubscriptionParamsDto = req.params

        await deleteJobSubscriptionByIdService(params.id)
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobSubscriptionNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_SUBSCRIPTION_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
} */
