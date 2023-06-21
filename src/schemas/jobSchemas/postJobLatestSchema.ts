import Joi from "joi"
import { JobLatestDto } from "../../dto/jobDtos/jobDto"

export default Joi.object<Partial<JobLatestDto>>({
    search: Joi.string(),
    orderBy: Joi.string(),
    // range: Joi.object({
    //     min: Joi.number().required(),
    //     max: Joi.number().required(),
    // }),
    range: Joi.number(),
    category: Joi.string(),
    page: Joi.number(),
    limitPerPage: Joi.number(),
})
