import Joi from "joi"
import { BetSubscriptionDto } from "../../../dto/betDtos/betSubscriptionDto"

export default Joi.object<Partial<BetSubscriptionDto>>({
    betId: Joi.number(),
    title: Joi.string(),
    vote: Joi.boolean(),
})
