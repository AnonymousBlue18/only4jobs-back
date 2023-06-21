import { Op } from "sequelize"
import {
    JobAllStatusDto,
    JobDto,
    JobLatestDto,
    JobPageDto,
    JobStatusDto,
} from "../../dto/jobDtos/jobDto"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import CannotDeleteJobException from "../../errors/jobErrors/CannotDeleteJobException"
import CannotDeleteOthersJobException from "../../errors/jobErrors/CannotDeleteOthersJobException"
import JobNotFoundException from "../../errors/jobErrors/JobNotFoundException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import Job from "../../models/jobModels/Job"
import JobSubscription from "../../models/jobModels/JobSubscription"
import User from "../../models/userModels/User"
import { parseFile } from "../../utils/useFile"
import { parseToken } from "../../utils/useToken"

//POST JOB
export const postJob = async (body: JobDto, userId: number) => {
    const user = await User.findOne({
        where: { id: userId },
    })

    if (!user) {
        throw new UserNotFoundException()
    }
    const [job, created] = await Job.findOrCreate({
        where: { ...body },
        defaults: { ...body, userId: userId },
    })

    if (!created) {
        throw new CannotCreateException()
    }
    return job
}

//POST ALL JOBS (ROL ADMIN)
export const postAllJobs = async (body: Partial<JobAllStatusDto>) => {
    const filters: any = {
        search: body?.search ?? "",
        orderBy: [],
        range: body?.range ?? { min: 0, max: Number.MAX_VALUE },
        category: body?.category ?? "",
        page: body?.page ?? 1,
        limitPerPage: body?.limitPerPage ?? 4,
        status: body?.status ?? "",
    }

    const page = parseInt(filters.page || "1")
    const limit = filters.limitPerPage
    const offset = (page - 1) * limit

    const searchConditions: any = {
        category: { [Op.like]: `${filters.category}%` },
        salary: { [Op.lte]: filters.range.max, [Op.gte]: filters.range.min },
    }

    if (filters.search) {
        searchConditions.titleJob = { [Op.like]: `${filters.search}%` }
    }

    if (filters.status) {
        searchConditions.status = { [Op.like]: `${filters.status}%` }
    }

    const totalCount = await Job.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const orderBy =
        filters.orderBy === "Z-A"
            ? [["titleJob", "DESC"]]
            : [["titleJob", "ASC"]]

    const jobs = await Job.findAll({
        where: searchConditions,
        attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "deletedAt"],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
        order: filters.orderBy,
        limit: limit,
        offset: offset,
    })

    const parsedJobs = jobs
        .map(item => item.toJSON() as any)
        .map(item => ({
            ...item,
            User: {
                ...item.User,
                image: item.User.image
                    ? parseFile(item.User.image)
                    : item.User.image,
            },
        }))

    return {
        parsedJobs,
        page,
        totalPages,
        totalCount,
    }
}

//POST ALL LASTEST JOBS (NO NECESITAN ROL)
export const postAllLatestJobs = async (
    body: Partial<JobLatestDto>,
    token: string | undefined
) => {
    const filters: any = {
        search: body?.search ?? "",
        orderBy: [],
        range: body?.range ?? Number.MAX_VALUE,
        category: body?.category ?? "",
        page: body?.page ?? 1,
        limitPerPage: body?.limitPerPage ?? 4,
    }

    const page = parseInt(filters.page || "1")
    const limit = filters.limitPerPage
    const offset = (page - 1) * limit

    const searchConditions: any = {
        status: "active",
        category: { [Op.like]: `${filters.category}%` },
        // salary: { [Op.lte]: filters.range.max, [Op.gte]: filters.range.min },
        salary: { [Op.lte]: filters.range },
    }

    if (filters.search) {
        searchConditions.titleJob = { [Op.like]: `%${filters.search}%` }
    }

    let payload = null

    if (token) {
        payload = parseToken(token)
    }

    if (payload) {
        searchConditions.userId = { [Op.ne]: payload.id }
    }

    const totalCount = await Job.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const orderBy =
        filters.orderBy === "Z-A"
            ? [["titleJob", "DESC"]]
            : [["titleJob", "ASC"]]

    const jobs = await Job.findAll({
        where: searchConditions,
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
        order: filters.orderBy,
        limit: limit,
        offset: offset,
    })

    const parsedJobs = jobs
        .map(item => item.toJSON() as any)
        .map(item => ({
            ...item,
            User: {
                ...item.User,
                image: item.User.image
                    ? parseFile(item.User.image)
                    : item.User.image,
            },
        }))

    return {
        parsedJobs,
        page,
        totalPages,
        totalCount,
    }
}

//GET ALL MY JOBS
export const getAllMyJobs = async (
    body: Partial<JobPageDto>,
    userId: number
) => {
    const filters: any = {
        page: body?.page ?? 1,
    }

    const page = parseInt(filters.page || "1")
    const limit = 4
    const offset = (page - 1) * limit

    const searchConditions: any = {
        userId: userId,
    }
    const totalCount = await Job.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const jobs = await Job.findAll({
        where: searchConditions,
        attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "deletedAt"],
        },
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })
    const parsedJobs = await Promise.all(
        jobs
            .map(item => item.toJSON() as any)
            .map(async item => ({
                ...item,
                totalAcceptedCount: await JobSubscription.count({
                    where: {
                        jobId: item.id,
                        status: "working",
                    },
                }),
                User: {
                    ...item.User,
                    image: item.User.image
                        ? parseFile(item.User.image)
                        : item.User.image,
                },
            }))
    )
    return { jobs: parsedJobs, page, totalPages, totalCount }
}

//GET JOB BY ID (NO NECESITAN ROL)
export const getJobById = async (id: number, userId: number) => {
    const job: any = await Job.findOne({
        where: { id: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })

    if (!job) {
        throw new JobNotFoundException()
    }

    if (job.dataValues.status !== "active") {
        if (job.dataValues.userId !== userId) {
            throw new JobNotFoundException()
        }
    }

    const isJoined =
        (await JobSubscription.count({
            where: { susbscriptorId: userId, jobId: id },
        })) > 0

    const parsedJob = {
        totalAcceptedCount: await JobSubscription.count({
            where: {
                jobId: job.id,
                status: "working",
            },
        }),
        isJoined,
        isOwner: job.userId === userId,
        ...job.toJSON(),
        User: {
            ...job.toJSON().User,
            image: job.toJSON().User.image
                ? parseFile(job.toJSON().User.image)
                : job.toJSON().User.image,
        },
    }

    return parsedJob
}

//GET ALL JOBS BY USER ID (NO NECESITAN ROL)
export const getAllJobsByUserId = async (
    id: number,
    body: Partial<JobPageDto>
) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }

    const filters: any = {
        page: body?.page ?? 1,
    }

    const page = parseInt(filters.page || "1")
    const limit = 4
    const offset = (page - 1) * limit

    const searchConditions: any = {
        status: "active",
        userId: id,
    }
    const totalCount = await Job.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const jobs = await Job.findAll({
        where: searchConditions,
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })

    const parsedJobs = await Promise.all(
        jobs
            .map(item => item.toJSON() as any)
            .map(async item => ({
                ...item,
                totalAcceptedCount: await JobSubscription.count({
                    where: {
                        jobId: item.id,
                        status: "working",
                    },
                }),
                User: {
                    ...item.User,
                    image: item.User.image
                        ? parseFile(item.User.image)
                        : item.User.image,
                },
            }))
    )
    return { jobs: parsedJobs, page, totalPages, totalCount }
}

/* //GET JOB BY USER ID
export const getJobsByUserId = async (id: number) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }
    const job: any = await Job.findOne({
        where: { userId: id, status: true },
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })
    if (!job) {
        throw new JobNotFoundException()
    }
    const parsedJob = {
        ...job.toJSON(),
        User: {
            ...job.toJSON().User,
            image: job.toJSON().User.image
                ? parseFile(job.toJSON().User.image)
                : job.toJSON().User.image,
        },
    }

    return parsedJob
} 
 */

//PUT JOB BY ID
export const putJobById = async (id: number, body: Partial<JobStatusDto>) => {
    const job = await Job.update(body, { where: { id: id } })
    if (job[0] <= 0) {
        throw new JobNotFoundException()
    }
}

//PUT JOB STATUS BY ID (ROL ADMIN)
export const putJobStatusById = async (id: number, body: JobStatusDto) => {
    const jobStatus = await Job.findOne({
        where: { id: id },
    })
    if (!jobStatus) {
        throw new CannotCreateException()
    }

    const bet = await Job.update(body, { where: { id: id } })
    if (bet[0] <= 0) {
        throw new JobNotFoundException()
    }
}

//DEL JOB BY ID
export const deleteJobById = async (id: number, userId: number) => {
    const jobToDelete = await Job.findOne({
        where: { id: id },
    })

    if (!jobToDelete) {
        throw new JobNotFoundException()
    }

    if (jobToDelete.userId != userId) {
        throw new CannotDeleteOthersJobException()
    }

    const jobSubscription = await JobSubscription.count({
        where: { jobId: jobToDelete.id, status: "working" },
    })
    if (jobSubscription > 0) {
        throw new CannotDeleteJobException()
    }

    const job = await Job.destroy({ where: { id: id } })
    if (job <= 0) {
        throw new JobNotFoundException()
    }
}
