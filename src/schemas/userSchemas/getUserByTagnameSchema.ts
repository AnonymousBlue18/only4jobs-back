import Joi from "joi"

export default Joi.object({
    tag: Joi.string().required(),
})
