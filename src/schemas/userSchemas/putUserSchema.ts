import Joi from "joi"
import { PutOwnUserDto } from "../../dto/userDtos/userDto"

export default Joi.object<Partial<PutOwnUserDto>>({
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
