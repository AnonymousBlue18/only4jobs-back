import Joi from "joi"
import { JobStatusDto } from "../../dto/jobDtos/jobDto"

export default Joi.object<JobStatusDto>({
    status: Joi.string().required(),
})
