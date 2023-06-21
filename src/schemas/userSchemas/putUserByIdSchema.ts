import Joi from "joi"
import { PutUserDto } from "../../dto/userDtos/userDto"

export default Joi.object<Partial<PutUserDto>>({
    tag: Joi.string(),
    name: Joi.string(),
    lastname: Joi.string(),
    dateOfBirth: Joi.date(),
    phone: Joi.string(),
    country: Joi.string(),
    studies: Joi.string(),
    laboralExperience: Joi.string(),
    email: Joi.string()
        .email()
        .message("El correo debe de ser con un formato valido"),
})
