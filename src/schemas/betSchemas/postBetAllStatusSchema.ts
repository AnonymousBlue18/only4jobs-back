import Joi from "joi"
import { BetAllStatusDto } from "../../dto/betDtos/betDto"

export default Joi.object<Partial<BetAllStatusDto>>({
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
