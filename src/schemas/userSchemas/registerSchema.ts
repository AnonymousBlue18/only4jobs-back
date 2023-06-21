import Joi from "joi"

export default Joi.object({
    tag: Joi.string().required(),
    name: Joi.string().required(),
    lastname: Joi.string().required(),
    email: Joi.string()
        .required()
        .email()
        .message("El correo debe de ser con un formato valido"),
    password: Joi.string()
        .min(8)
        .message("La contraseña debe ser minimo de 8 caracteres")
        .required(),
})
