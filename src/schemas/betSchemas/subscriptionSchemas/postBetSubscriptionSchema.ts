import Joi from "joi"
import { BetSubscriptionDto } from "../../../dto/betDtos/betSubscriptionDto"

export default Joi.object<BetSubscriptionDto>({
    betId: Joi.number().required(),
    title: Joi.string().required(),
    vote: Joi.boolean().required(),
})
