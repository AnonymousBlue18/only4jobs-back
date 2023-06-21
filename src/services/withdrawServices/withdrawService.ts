import {
    WithdrawDto,
    WithdrawPayedDto,
} from "../../dto/withdrawDtos/withdrawDto"
import BetNotFoundException from "../../errors/betErrors/BetNotFoundException"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import WithdrawNotFoundException from "../../errors/withdrawErrors/WithdrawNotFoundException"
import Bet from "../../models/betModels/Bet"
import User from "../../models/userModels/User"
import Withdraw from "../../models/withdrawsModels/Withdraw"

//GET ALL WITHDRAWS
export const getAllWithdraws = async () => {
    const Withdraws = await Withdraw.findAll({
        where: { status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    return Withdraws
}

//GET WITHDRAW BY ID
export const getWithdrawById = async (id: number) => {
    const withdraw = await Withdraw.findOne({
        where: { id: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!withdraw) {
        throw new WithdrawNotFoundException()
    }
    return withdraw
}

//GET WITHDRAW BY BET ID
export const getWithdrawsByBetId = async (id: number) => {
    const bet = await Bet.findOne({
        where: { id: id, status: true },
    })
    if (!bet) {
        throw new BetNotFoundException()
    }
    const withdraw = await Withdraw.findAll({
        where: { betId: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!withdraw) {
        throw new WithdrawNotFoundException()
    }
    return withdraw
}

//GET WITHDRAW BY USER ID
export const getWithdrawsByUserId = async (id: number) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }
    const withdraws = await Withdraw.findAll({
        where: { winnerId: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!withdraws) {
        throw new WithdrawNotFoundException()
    }
    return withdraws
}

//GET ALL WITHDRAWS BY USER ID
export const getAllWithdrawsByUserId = async (id: number) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }

    const withdraws = await Withdraw.findAll({
        where: { status: true, winnerId: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })

    return withdraws
}

//PUT WITHDRAW BY ID
export const putWithdrawById = async (
    id: number,
    body: Partial<WithdrawDto>
) => {
    const withdraw = await Withdraw.update(body, {
        where: { id: id, status: true },
    })
    if (withdraw[0] <= 0) {
        throw new WithdrawNotFoundException()
    }
}

//PUT WITHDRAW PAYED ADMIN
export const putWithdrawPayedById = async (
    id: number,
    body: Partial<WithdrawPayedDto>
) => {
    const withdraw = await Withdraw.update(body, {
        where: { id: id, status: true },
    })
    if (withdraw[0] <= 0) {
        throw new WithdrawNotFoundException()
    }
}

//DEL WITHDRAW BY ID
export const deleteWithdrawById = async (id: number) => {
    const withdraw = await Withdraw.update(
        { status: false },
        { where: { id: id, status: true } }
    )
    if (withdraw[0] <= 0) {
        throw new WithdrawNotFoundException()
    }
}

//POST WITHDRAW
export const postWithdraw = async (body: WithdrawDto) => {
    const bet = await Bet.findOne({
        where: { id: body.betId },
    })

    if (!bet) {
        throw new BetNotFoundException()
    }
    const [withdraw, created] = await Withdraw.findOrCreate({
        where: { ...body },
        defaults: { ...body },
    })

    if (!created) {
        throw new CannotCreateException()
    }
    return withdraw
}
