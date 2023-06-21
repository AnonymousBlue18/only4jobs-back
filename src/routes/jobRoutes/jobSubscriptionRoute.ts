import { Router } from "express"
import {
    getAllJobSubscriptions,
    getAllMyJobSubscriptions,
    getJobSubscriptionById,
    postJobSubscription,
} from "../../controllers/jobControllers/jobSubscriptionController"
import { JobSubscriptionDto } from "../../dto/jobDtos/jobSubscriptionDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getJobSubscriptionByIdSchema from "../../schemas/jobSchemas/subscriptionSchemas/getJobSubscriptionByIdSchema"
import postJobSubscriptionSchema from "../../schemas/jobSchemas/subscriptionSchemas/postJobSubscriptionSchema"

const jobSubscriptionRouter = Router()

//ROUTES

//POST JOBSUBSCRIPTION (ROL USER LOGUEADO)
jobSubscriptionRouter.post(
    "/subscriptions/jobs",
    validatorBody(postJobSubscriptionSchema),
    authentication(),
    postJobSubscription
)

//GET JOBSUBSCRIPTION BY ID (ROL USER LOGUEADO)
jobSubscriptionRouter.get<any, JobSubscriptionDto>(
    "/subscriptions/jobs/:id",
    validatorParams(getJobSubscriptionByIdSchema),
    authentication(),
    getJobSubscriptionById
)

//GET ALL MY JOBSUBSCRIPTIONS (ROL USER LOGUEADO)
jobSubscriptionRouter.get<any, JobSubscriptionDto>(
    "/subscriptions/myjobs",
    authentication(),
    getAllMyJobSubscriptions
)

//GET ALL JOBSUBSCRIPTIONS (ROL ADMIN)
jobSubscriptionRouter.get(
    "/subscriptions/jobs",
    authentication([ProfileEnum.ADMIN]),
    getAllJobSubscriptions
)

/* //GET ALL JOBSUBSCRIPTIONS BY ID
jobSubscriptionRouter.get<any, JobSubscriptionDto>(
    "/subscriptions/jobs/user/:id",
    authentication(),
    validatorParams(getJobSubscriptionByIdSchema),
    getAllJobSubscriptionsById
) */

/* //PUT JOBSUBSCRIPTION BY ID
jobSubscriptionRouter.put<any, JobSubscriptionDto>(
    "/subscriptions/jobs/:id",
    authentication(),
    validatorParams(getJobSubscriptionByIdSchema),
    validatorBody(putJobSubscriptionByIdSchema),
    putJobSubscriptionById
) */

/* //DEL JOBSUBSCRIPTION BY ID
jobSubscriptionRouter.delete<any, JobSubscriptionDto>(
    "/subscriptions/jobs/:id",
    authentication(),
    validatorParams(getJobSubscriptionByIdSchema),
    deleteJobSubscriptionById
) */

export default jobSubscriptionRouter
