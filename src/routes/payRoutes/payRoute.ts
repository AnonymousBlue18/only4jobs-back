import { Router } from "express"
import {
    deletePayById,
    getAllPays,
    getAllPaysByUserId,
    getPayById,
    getPaysByBetId,
    getPaysByUserId,
    postPay,
    putPayById,
    putPayPayedById,
} from "../../controllers/payControllers/payController"
import { PayDto } from "../../dto/payDtos/payDto"
import { ProfileEnum } from "../../interfaces/utils/Profiles"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getPayByIdSchema from "../../schemas/paySchemas/getPayByIdSchema"
import postPaySchema from "../../schemas/paySchemas/postPaySchema"
import putPayByIdSchema from "../../schemas/paySchemas/putPayByIdSchema"
import putPayPayedByIdSchema from "../../schemas/paySchemas/putPayPayedByIdSchema"

const payRouter = Router()

//ROUTES

//GET ALL PAYS
payRouter.get("/pays", authentication(), getAllPays)

//GET PAY BY ID
payRouter.get<any, PayDto>(
    "/pays/:id",
    authentication(),
    validatorParams(getPayByIdSchema),
    getPayById
)

//GET PAY BY BET ID
payRouter.get<any, PayDto>(
    "/pays/bet/:id",
    authentication(),
    validatorParams(getPayByIdSchema),
    getPaysByBetId
)

//GET PAY BY USER ID
payRouter.get<any, PayDto>(
    "/pays/user/:id",
    authentication(),
    validatorParams(getPayByIdSchema),
    getPaysByUserId
)

//GET ALL PAYS BY USER ID
payRouter.get<any, PayDto>(
    "/pays/user/all/:id",
    authentication(),
    validatorParams(getPayByIdSchema),
    getAllPaysByUserId
)

//PUT PAY BY ID
payRouter.put<any, PayDto>(
    "/pays/:id",
    authentication(),
    validatorParams(getPayByIdSchema),
    validatorBody(putPayByIdSchema),
    putPayById
)

//PUT PAY PAYED ADMIN
payRouter.put<any, PayDto>(
    "/pays/payed/:id",
    authentication([ProfileEnum.ADMIN]),
    validatorParams(getPayByIdSchema),
    validatorBody(putPayPayedByIdSchema),
    putPayPayedById
)

//DEL PAY BY ID
payRouter.delete<any, PayDto>(
    "/pays/:id",
    authentication(),
    validatorParams(getPayByIdSchema),
    deletePayById
)

//POST PAY
payRouter.post("/pays", authentication(), validatorBody(postPaySchema), postPay)

export default payRouter
