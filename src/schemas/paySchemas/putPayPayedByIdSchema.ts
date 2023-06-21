import Joi from "joi"
import { PayPayedDto } from "../../dto/payDtos/payDto"

export default Joi.object<PayPayedDto>({
    payed: Joi.boolean().required(),
})
