import Joi from "joi"
import { JobDto } from "../../dto/jobDtos/jobDto"

export default Joi.object<Partial<JobDto>>({
    userId: Joi.number(),
    titleJob: Joi.string(),
    timeJob: Joi.string(),
    category: Joi.string(),
    workplace: Joi.string(),
    typeJob: Joi.string(),
    publishDate: Joi.date(),
    salary: Joi.number(),
    description: Joi.string(),
})
