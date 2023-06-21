import Joi from "joi"
import { WithdrawPayedDto } from "../../dto/withdrawDtos/withdrawDto"

export default Joi.object<WithdrawPayedDto>({
    payed: Joi.boolean().required(),
})
