import Joi from "joi"
import { JobSubscriptionDto } from "../../../dto/jobDtos/jobSubscriptionDto"

export default Joi.object<JobSubscriptionDto>({
    jobId: Joi.number().required(),
})
