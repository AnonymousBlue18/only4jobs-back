import Joi from "joi"
import { JobDto } from "../../dto/jobDtos/jobDto"

export default Joi.object<JobDto>({
    titleJob: Joi.string().required(),
    timeJob: Joi.string().required(),
    category: Joi.string().required(),
    workplace: Joi.string().required(),
    typeJob: Joi.string().required(),
    publishDate: Joi.date().required(),
    salary: Joi.number().required().greater(0),
    description: Joi.string().required(),
})
