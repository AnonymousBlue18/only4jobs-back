import Joi from "joi"
import { BetLatestDto } from "../../dto/betDtos/betDto"

export default Joi.object<Partial<BetLatestDto>>({
    search: Joi.string(),
    orderBy: Joi.string(),
    range: Joi.number(),
    category: Joi.string(),
    page: Joi.number(),
    limitPerPage: Joi.number(),
})
