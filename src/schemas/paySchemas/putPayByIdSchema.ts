import Joi from "joi"
import { PayDto } from "../../dto/payDtos/payDto"

export default Joi.object<Partial<PayDto>>({
    date: Joi.date(),
    title: Joi.string(),
})
