import Joi from "joi"
import { BetPageDto } from "../../dto/betDtos/betDto"

export default Joi.object<Partial<BetPageDto>>({
    page: Joi.number(),
})
