import Joi from "joi"
import { PayDto } from "../../dto/payDtos/payDto"

export default Joi.object<PayDto>({
    betId: Joi.number().required(),
    winnerId: Joi.number().required(),
    date: Joi.date().required(),
    title: Joi.string().required(),
})
