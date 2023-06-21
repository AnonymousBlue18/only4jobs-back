import Joi from "joi"
import { BetDto } from "../../dto/betDtos/betDto"

export default Joi.object<Partial<BetDto>>({
    title: Joi.string(),
    category: Joi.string(),
    description: Joi.string(),
    endDate: Joi.date(),
    price: Joi.number(),
    question: Joi.string(),
    prediction: Joi.boolean(),
})
