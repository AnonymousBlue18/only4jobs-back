import Joi from "joi"
import { WithdrawDto } from "../../dto/withdrawDtos/withdrawDto"

export default Joi.object<WithdrawDto>({
    betId: Joi.number().required(),
    winnerId: Joi.number().required(),
    date: Joi.date().required(),
    title: Joi.string().required(),
})
