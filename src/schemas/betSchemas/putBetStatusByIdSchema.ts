import Joi from "joi"
import { BetStatusDto } from "../../dto/betDtos/betDto"

export default Joi.object<BetStatusDto>({
    status: Joi.string().required(),
})
