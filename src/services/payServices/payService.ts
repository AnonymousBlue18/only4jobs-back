import { PayDto, PayPayedDto } from "../../dto/payDtos/payDto"
import BetNotFoundException from "../../errors/betErrors/BetNotFoundException"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import PayNotFoundException from "../../errors/payErrors/PayNotFoundException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import Bet from "../../models/betModels/Bet"
import Pay from "../../models/paysModels/Pay"
import User from "../../models/userModels/User"

//GET ALL PAYS
export const getAllPays = async () => {
    const pays = await Pay.findAll({
        where: { status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    return pays
}

//GET PAY BY ID
export const getPayById = async (id: number) => {
    const pay = await Pay.findOne({
        where: { id: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!pay) {
        throw new PayNotFoundException()
    }
    return pay
}

//GET PAY BY BET ID
export const getPaysByBetId = async (id: number) => {
    const bet = await Bet.findOne({ where: { id: id, status: true } })
    if (!bet) {
        throw new BetNotFoundException()
    }
    const pays = await Pay.findAll({
        where: { betId: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!pays) {
        throw new PayNotFoundException()
    }
    return pays
}

//GET PAY BY USER ID
export const getPaysByUserId = async (id: number) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }
    const pays = await Pay.findAll({
        where: { winnerId: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!pays) {
        throw new PayNotFoundException()
    }
    return pays
}

//GET ALL PAYS BY USER ID
export const getAllPaysByUserId = async (id: number) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }

    const pays = await Pay.findAll({
        where: { status: true, winnerId: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })

    return pays
}

//PUT PAY BY ID
export const putPayById = async (id: number, body: Partial<PayDto>) => {
    const pay = await Pay.update(body, { where: { id: id, status: true } })
    if (pay[0] <= 0) {
        throw new PayNotFoundException()
    }
}

//PUT PAY PAYED ADMIN
export const putPayPayedById = async (
    id: number,
    body: Partial<PayPayedDto>
) => {
    const pay = await Pay.update(body, { where: { id: id, status: true } })
    if (pay[0] <= 0) {
        throw new PayNotFoundException()
    }
}

//DEL PAY BY ID
export const deletePayById = async (id: number) => {
    const pay = await Pay.update(
        { status: false },
        { where: { id: id, status: true } }
    )
    if (pay[0] <= 0) {
        throw new PayNotFoundException()
    }
}

//POST PAY
export const postPay = async (body: PayDto) => {
    if (body.betId === body.winnerId) {
        throw new UserSameIdException()
    }
    const bet = await Bet.findOne({
        where: { id: body.betId, status: true },
    })

    if (!bet) {
        throw new BetNotFoundException()
    }

    const winnerId = await Bet.findOne({
        where: { id: body.winnerId, status: true },
    })

    if (!winnerId) {
        throw new UserNotFoundException()
    }
    const pay = await Pay.findOne({
        where: {
            betId: body.betId,
            winnerId: body.winnerId,
            status: true,
        },
    })

    if (pay !== null) {
        throw new CannotCreateException()
    }
    const newPay = await Pay.create({
        ...body,
    })

    return newPay
}
