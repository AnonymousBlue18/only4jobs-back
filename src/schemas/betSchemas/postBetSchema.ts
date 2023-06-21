import Joi from "joi"
import { BetDto } from "../../dto/betDtos/betDto"

export default Joi.object<BetDto>({
    title: Joi.string().required(),
    category: Joi.string().required(),
    description: Joi.string().required(),
    endDate: Joi.date().required(),
    price: Joi.number().required(),
    question: Joi.string().required(),
    prediction: Joi.boolean().required(),
})
