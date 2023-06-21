import Joi from "joi"
import { JobAllStatusDto } from "../../dto/jobDtos/jobDto"

export default Joi.object<Partial<JobAllStatusDto>>({
    search: Joi.string(),
    orderBy: Joi.string(),
    range: Joi.object({
        min: Joi.number().required(),
        max: Joi.number().required(),
    }),
    category: Joi.string(),
    page: Joi.number(),
    limitPerPage: Joi.number(),
    status: Joi.string(),
})
