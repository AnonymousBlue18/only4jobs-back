import { Request, Response } from "express"
import {
    JobAllStatusDto,
    JobDto,
    JobLatestDto,
    JobPageDto,
    JobParamsDto,
    JobStatusDto,
    JobUserTokenDto,
} from "../../dto/jobDtos/jobDto"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import CannotDeleteJobException from "../../errors/jobErrors/CannotDeleteJobException"
import CannotDeleteOthersJobException from "../../errors/jobErrors/CannotDeleteOthersJobException"
import JobNotFoundException from "../../errors/jobErrors/JobNotFoundException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    deleteJobById as deleteJobByIdService,
    getAllJobsByUserId as getAllJobsByUserIdService,
    getAllMyJobs as getAllMyJobsService,
    getJobById as getJobByIdService,
    postAllJobs as postAllJobsService,
    postAllLatestJobs as postAllLatestJobsService,
    postJob as postJobService,
    putJobById as putJobByIdService,
    putJobStatusById as putJobStatusByIdService,
} from "../../services/jobServices/jobService"

//POST JOB
export const postJob = async (req: Request, res: Response) => {
    try {
        const body: JobDto = req.body
        await postJobService(body, Number(req.params.userTokenId))
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

//POST ALL JOBS (ROL ADMIN)
export const postAllJobs = async (req: Request, res: Response) => {
    try {
        const body: JobAllStatusDto = req.body
        const jobs = await postAllJobsService(body)
        res.status(200).json({
            data: jobs,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//POST ALL LASTEST JOBS (NO NECESITAN ROL)
export const postAllLatestJobs = async (req: Request, res: Response) => {
    try {
        const body: JobLatestDto = req.body
        const jobs = await postAllLatestJobsService(
            body,
            req.headers.authorization
        )
        res.status(200).json({
            data: jobs,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET ALL My JOBS
export const getAllMyJobs = async (
    req: Request<JobUserTokenDto>,
    res: Response
) => {
    try {
        const params: JobUserTokenDto = req.params
        const bodyPage: JobPageDto = req.body

        const job = await getAllMyJobsService(
            bodyPage,
            Number(params?.userTokenId)
        )
        res.status(200).json({
            data: job,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
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

//GET JOB BY ID (NO NECESITAN ROL)
export const getJobById = async (req: Request<JobParamsDto>, res: Response) => {
    try {
        const params: JobParamsDto = req.params
        const job = await getJobByIdService(
            params.id,
            Number(params?.userTokenId)
        )
        res.status(200).json({
            data: job,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//GET ALL JOBS BY USER ID (NO NECESITAN ROL)
export const getAllJobsByUserId = async (
    req: Request<JobParamsDto>,
    res: Response
) => {
    try {
        const body: JobParamsDto = req.params
        const bodyPage: JobPageDto = req.body
        const job = await getAllJobsByUserIdService(body.id, bodyPage)
        res.status(200).json({
            data: job,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
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

/* //GET JOB BY USER ID
export const getJobsByUserId = async (
    req: Request<JobParamsDto>,
    res: Response
) => {
    try {
        const body: JobParamsDto = req.params
        const job = await getJobsByUserIdService(body.id)
        res.status(200).json({
            data: job,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
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
} */

//PUT JOB BY ID
export const putJobById = async (req: Request<JobParamsDto>, res: Response) => {
    try {
        const params: JobParamsDto = req.params
        const body: Partial<JobStatusDto> = req.body
        await putJobByIdService(params.id, body)
        res.status(200).json({
            message: ResponseDictionary.UPDATE,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//PUT JOB STATUS BY ID (ROL ADMIN)
export const putJobStatusById = async (
    req: Request<JobParamsDto>,
    res: Response
) => {
    try {
        const params: JobParamsDto = req.params
        const body: JobStatusDto = req.body
        await putJobStatusByIdService(params.id, body)
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
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//DEL JOB BY ID
export const deleteJobById = async (
    req: Request<JobParamsDto>,
    res: Response
) => {
    try {
        const params: JobParamsDto = req.params
        await deleteJobByIdService(params.id, Number(params?.userTokenId))
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof CannotDeleteJobException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_DELETE_JOB,
            })
            return
        }

        if (error instanceof CannotDeleteOthersJobException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_DELETE_OTHERS_JOB,
            })
            return
        }
        if (error instanceof JobNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.JOB_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}
