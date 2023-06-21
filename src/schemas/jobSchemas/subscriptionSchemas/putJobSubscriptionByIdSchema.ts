import Joi from "joi"
import { JobSubscriptionDto } from "../../../dto/jobDtos/jobSubscriptionDto"

export default Joi.object<Partial<JobSubscriptionDto>>({
    subscriptorId: Joi.number(),
    jobId: Joi.number(),
})
