import Joi from "joi"
import { UserLimitDto } from "../../dto/userDtos/userDto"

export default Joi.object<Partial<UserLimitDto>>({
    page: Joi.number(),
})
