import { Router } from "express"
import {
    login,
    register,
} from "../../controllers/userControllers/authController"
import { validatorBody } from "../../middlewares/validator"
import loginSchema from "../../schemas/userSchemas/loginSchema"
import registerSchema from "../../schemas/userSchemas/registerSchema"

const authRouter = Router()
//ROUTES
authRouter.post("/login", validatorBody(loginSchema), login)
authRouter.post("/register", validatorBody(registerSchema), register)

export default authRouter
