import Joi from "joi"
import { JobPageDto } from "../../dto/jobDtos/jobDto"

export default Joi.object<Partial<JobPageDto>>({
    page: Joi.number(),
})
