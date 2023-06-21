import Joi from "joi"
import { BetAnswerDto } from "../../dto/betDtos/betDto"

export default Joi.object<BetAnswerDto>({
    answer: Joi.boolean().required(),
})
