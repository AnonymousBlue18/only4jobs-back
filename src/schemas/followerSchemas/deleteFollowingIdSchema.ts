import Joi from "joi"

export default Joi.object({
    followingId: Joi.number().required(),
})
