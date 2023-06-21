import Joi from "joi"

export default Joi.object({
    followerId: Joi.number().required(),
})
