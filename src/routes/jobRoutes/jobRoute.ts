import { Router } from "express"
import {
    deleteJobById,
    getAllJobsByUserId,
    getAllMyJobs,
    getJobById,
    postAllJobs,
    postAllLatestJobs,
    postJob,
    putJobById,
    putJobStatusById,
} from "../../controllers/jobControllers/jobController"
import { JobDto } from "../../dto/jobDtos/jobDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getJobByIdSchema from "../../schemas/jobSchemas/getJobByIdSchema"
import getJobPageSchema from "../../schemas/jobSchemas/getJobPageSchema"
import postJobAllStatusSchema from "../../schemas/jobSchemas/postJobAllStatusSchema"
import postJobLatestSchema from "../../schemas/jobSchemas/postJobLatestSchema"
import postJobSchema from "../../schemas/jobSchemas/postJobSchema"
import putJobStatusByIdSchema from "../../schemas/jobSchemas/putJobStatusByIdSchema"
const jobRouter = Router()

//ROUTES

//POST JOB
jobRouter.post("/jobs", validatorBody(postJobSchema), authentication(), postJob)

//POST ALL JOBS (ROL ADMIN)
jobRouter.post(
    "/jobs/all",
    validatorBody(postJobAllStatusSchema),
    authentication([ProfileEnum.ADMIN]),
    postAllJobs
)

//POST ALL LASTEST (NO NECESITAN ROL)
jobRouter.post(
    "/jobs/latest",
    validatorBody(postJobLatestSchema),
    postAllLatestJobs
)

//GET ALL My JOBS
jobRouter.get<any, JobDto>(
    "/jobs/my/jobs",
    validatorBody(getJobPageSchema),
    authentication(),
    getAllMyJobs
)

//GET JOB BY ID (NO NECESITAN ROL)
jobRouter.get<any, JobDto>(
    "/jobs/:id",
    validatorParams(getJobByIdSchema),
    authentication(),
    getJobById
)

//GET ALLS JOBS BY USER ID
jobRouter.get<any, JobDto>(
    "/jobs/user/all/:id",
    validatorParams(getJobByIdSchema),
    authentication(),
    getAllJobsByUserId
)

/* //GET JOB BY USER ID
jobRouter.get<any, JobDto>(
    "/jobs/user/:id",
    authentication(),
    validatorParams(getJobByIdSchema),
    getJobsByUserId
)
 */

//PUT JOB BY ID
jobRouter.put<any, JobDto>(
    "/jobs/:id",
    validatorParams(getJobByIdSchema),
    validatorBody(putJobStatusByIdSchema),
    authentication(),
    putJobById
)

//PUT JOB STATUS BY ID (ROL ADMIN)
jobRouter.put<any, JobDto>(
    "/jobs/status/:id",
    validatorParams(getJobByIdSchema),
    validatorBody(putJobStatusByIdSchema),
    authentication([ProfileEnum.ADMIN]),
    putJobStatusById
)

//DEL JOB BY ID
jobRouter.delete<any, JobDto>(
    "/jobs/:id",
    validatorParams(getJobByIdSchema),
    authentication(),
    deleteJobById
)

export default jobRouter
