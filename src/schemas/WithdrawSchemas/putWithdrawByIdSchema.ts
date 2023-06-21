import Joi from "joi"
import { WithdrawDto } from "../../dto/withdrawDtos/withdrawDto"

export default Joi.object<Partial<WithdrawDto>>({
    date: Joi.date(),
    title: Joi.string(),
})
