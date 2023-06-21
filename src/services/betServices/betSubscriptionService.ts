import { BetSubscriptionDto } from "../../dto/betDtos/betSubscriptionDto"
import BetNotAvailbleException from "../../errors/betErrors/BetNotAvailbleException"
import BetSubscriptionNotFoundException from "../../errors/betErrors/BetSubscriptionNotFoundException"
import VoteCannotCreateException from "../../errors/cannotErrors/VoteCannotCreateException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import Bet from "../../models/betModels/Bet"
import BetSubscription from "../../models/betModels/BetSubscription"
import User from "../../models/userModels/User"

//POST BETSUBSCRIPTION (ROL USER LOGUEADO)
export const postBetSubscription = async (
    body: BetSubscriptionDto,
    userId: number
) => {
    const userSubscriptor = await User.findOne({
        where: { id: userId },
    })
    if (!userSubscriptor) {
        throw new UserNotFoundException()
    }

    const bet = await Bet.findOne({
        where: { id: body.betId },
    })
    if (!bet || bet.endDate <= new Date()) {
        throw new BetNotAvailbleException()
    }
    if (bet.userId === userId) {
        throw new UserSameIdException()
    }

    const betSubscription = await BetSubscription.findOne({
        where: {
            susbscriptorId: userId,
            betId: body.betId,
        },
    })

    if (betSubscription !== null) {
        throw new VoteCannotCreateException()
    }

    const newBetSubscription = await BetSubscription.create({
        ...body,
        ownerId: bet.userId,
        susbscriptorId: userId,
    })

    return newBetSubscription
}

//GET BETSUBSCRIPTION BY ID (ROL USER LOGUEADO)
export const getBetSubscriptionById = async (id: number, userId: number) => {
    const betSubscription = await BetSubscription.findOne({
        where: { id: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })

    if (betSubscription?.susbscriptorId != userId) {
        throw new UserNotFoundException()
    }

    return betSubscription
}

//GET ALL MY BETSUBSCRIPTIONS (ROL USER LOGUEADO)
export const getAllMyBetSubscriptions = async (userId: number) => {
    const betSubscriptions = await BetSubscription.findAll({
        where: { susbscriptorId: userId },

        include: {
            model: Bet,
            attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
            },
        },
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "deletedAt",
                "susbscriptorId",
                "betId",
                "ownerId",
            ],
        },
    })

    if (!betSubscriptions) {
        throw new BetSubscriptionNotFoundException()
    }
    return betSubscriptions
}

//GET ALL BETSUBSCRIPTIONS (ROL ADMIN)
export const getAllBetSubscriptions = async () => {
    const betSubscriptions = await BetSubscription.findAll({
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
    })
    return betSubscriptions
}

/* //GET ALL BETSUBSCRIPTIONS BY ID
export const getAllBetSubscriptionsById = async (id: number) => {
    const betSubscriptions = await BetSubscription.findAll({
        where: { ownerId: id, status: true },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt", "status"],
        },
    })
    if (!betSubscriptions) {
        throw new BetSubscriptionNotFoundException()
    }
    return betSubscriptions
} */

/* //PUT BETSUBSCRIPTION BY ID
export const putBetSubscriptionById = async (
    id: number,
    body: Partial<BetSubscriptionDto>
) => {
    const betSubscription = await BetSubscription.update(body, {
        where: { id: id, status: true },
    })
    if (betSubscription[0] <= 0) {
        throw new BetSubscriptionNotFoundException()
    }
} */

/* //DEL BETSUBSCRIPTION BY ID
export const deleteBetSubscriptionById = async (id: number) => {
    const betSubscription = await BetSubscription.destroy({
        where: { id: id, status: true },
    })
    if (betSubscription <= 0) {
        throw new BetSubscriptionNotFoundException()
    }
} */
