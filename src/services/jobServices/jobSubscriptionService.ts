import { JobSubscriptionDto } from "../../dto/jobDtos/jobSubscriptionDto"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import JobNotAvailbleException from "../../errors/jobErrors/JobNotAvailbleException"
import JobSubscriptionNotFoundException from "../../errors/jobErrors/JobSubscriptionNotFoundException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import Job from "../../models/jobModels/Job"
import JobSubscription from "../../models/jobModels/JobSubscription"
import User from "../../models/userModels/User"

//POST JOBSUBSCRIPTION (ROL USER LOGUEADO)
export const postJobSubscription = async (
    body: JobSubscriptionDto,
    userId: number
) => {
    const userSubscriptor = await User.findOne({
        where: { id: userId },
    })
    if (!userSubscriptor) {
        throw new UserNotFoundException()
    }

    const job = await Job.findOne({
        where: { id: body.jobId },
    })

    if (!job) {
        throw new JobNotAvailbleException()
    }

    if (job.userId === userId) {
        throw new UserSameIdException()
    }

    const jobSubscription = await JobSubscription.findOne({
        where: {
            susbscriptorId: userId,
            jobId: body.jobId,
        },
    })

    if (jobSubscription !== null) {
        throw new CannotCreateException()
    }
    const newJobSubscription = await JobSubscription.create({
        ...body,
        ownerId: job.userId,
        susbscriptorId: userId,
    })

    return newJobSubscription
}

//GET JOBSUBSCRIPTION BY ID (ROL USER LOGUEADO)
export const getJobSubscriptionById = async (id: number, userId: number) => {
    const jobSubscription = await JobSubscription.findOne({
        where: { id: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (jobSubscription?.susbscriptorId != userId) {
        throw new UserNotFoundException()
    }
    return jobSubscription
}

//GET ALL MY JOBSUBSCRIPTIONS (ROL USER LOGUEADO)
export const getAllMyJobSubscriptions = async (userId: number) => {
    const jobSubscriptions = await JobSubscription.findAll({
        where: { susbscriptorId: userId },

        include: {
            model: Job,
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
        },
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "susbscriptorId",
                "jobId",
                "ownerId",
            ],
        },
    })

    if (!jobSubscriptions) {
        throw new JobSubscriptionNotFoundException()
    }
    return jobSubscriptions
}

//GET ALL JOBSUBSCRIPTIONS (ROL ADMIN)
export const getAllJobSubscriptions = async () => {
    const jobSubscriptions = await JobSubscription.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
    })
    return jobSubscriptions
}

/* //GET ALL JOBSUBSCRIPTIONS BY ID
export const getAllJobSubscriptionsById = async (id: number) => {
    const jobSubscriptions = await JobSubscription.findAll({
        where: { ownerId: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!jobSubscriptions) {
        throw new JobSubscriptionNotFoundException()
    }
    return jobSubscriptions
} */

/* //PUT JOBSUBSCRIPTION BY ID
export const putJobSubscriptionById = async (
    id: number,
    body: Partial<JobSubscriptionDto>
) => {
    const jobSubscription = await JobSubscription.update(body, {
        where: { id: id, status: true },
    })
    if (jobSubscription[0] <= 0) {
        throw new JobSubscriptionNotFoundException()
    }
} */

/* //DEL JOBSUBSCRIPTION BY ID
export const deleteJobSubscriptionById = async (id: number) => {
    const jobSubscription = await JobSubscription.update(
        { status: false },
        { where: { id: id, status: true } }
    )
    if (jobSubscription[0] <= 0) {
        throw new JobSubscriptionNotFoundException()
    }
} */
