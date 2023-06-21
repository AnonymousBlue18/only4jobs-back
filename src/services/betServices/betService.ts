import { Op } from "sequelize"
import {
    BetAllStatusDto,
    BetAnswerDto,
    BetDto,
    BetLatestDto,
    BetPageDto,
    BetStatusDto,
} from "../../dto/betDtos/betDto"
import BetNotFoundException from "../../errors/betErrors/BetNotFoundException"
import CannotDeleteBetException from "../../errors/betErrors/CannotDeleteBetException"
import CannotDeleteOthersBetException from "../../errors/betErrors/CannotDeleteOthersBetException"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import UserNotFoundException from "../../errors/userErrors/UserNotFoundException"
import Bet from "../../models/betModels/Bet"
import BetSubscription from "../../models/betModels/BetSubscription"
import User from "../../models/userModels/User"
import Withdraw from "../../models/withdrawsModels/Withdraw"
import { parseFile } from "../../utils/useFile"
import { parseToken } from "../../utils/useToken"

//POST BET
export const postBet = async (body: BetDto, userId: number) => {
    const user = await User.findOne({
        where: { id: userId },
    })

    if (!user) {
        throw new UserNotFoundException()
    }
    const [bet, created] = await Bet.findOrCreate({
        where: { ...body },
        defaults: { ...body, userId: userId },
    })

    if (!created) {
        throw new CannotCreateException()
    }
    return bet
}

//POST ALL BETS (ROL ADMIN)
export const postAllBets = async (body: Partial<BetAllStatusDto>) => {
    const filters: any = {
        search: body?.search ?? "",
        orderBy: [],
        range: body?.range ?? { min: 0, max: Number.MAX_VALUE },
        category: body?.category ?? "",
        page: body?.page ?? 1,
        limitPerPage: body?.limitPerPage ?? 4,
        status: body?.status ?? "",
    }

    const page = parseInt(filters.page || "1")
    const limit = filters.limitPerPage
    const offset = (page - 1) * limit

    const searchConditions: any = {
        category: { [Op.like]: `${filters.category}%` },
        price: { [Op.lte]: filters.range.max, [Op.gte]: filters.range.min },
    }

    if (filters.search) {
        searchConditions.title = { [Op.like]: `${filters.search}%` }
    }
    if (filters.status) {
        searchConditions.status = { [Op.like]: `${filters.status}%` }
    }

    const totalCount = await Bet.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const orderBy =
        filters.orderBy === "Z-A" ? [["title", "DESC"]] : [["title", "ASC"]]

    const bets = await Bet.findAll({
        where: searchConditions,
        attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "deletedAt"],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
        order: filters.orderBy,
        limit: limit,
        offset: offset,
    })
    const parsedBets = bets
        .map(item => item.toJSON() as any)
        .map(item => ({
            ...item,
            User: {
                ...item.User,
                image: item.User.image
                    ? parseFile(item.User.image)
                    : item.User.image,
            },
        }))

    return {
        parsedBets,
        page,
        totalPages,
        totalCount,
    }
}

//POST ALL LATEST BETS (NO NECESITAN ROL)
export const postAllLatestBets = async (
    body: Partial<BetLatestDto>,
    token: string | undefined
) => {
    const filters: any = {
        search: body?.search ?? "",
        orderBy: [],
        range: body?.range ?? Number.MAX_VALUE,
        category: body?.category ?? "",
        page: body?.page ?? 1,
        limitPerPage: body?.limitPerPage ?? 4,
    }

    const page = parseInt(filters.page || "1")
    const limit = filters.limitPerPage
    const offset = (page - 1) * limit

    const searchConditions: any = {
        status: "active",
        category: { [Op.like]: `${filters.category}%` },
        // price: { [Op.lte]: filters.range.max, [Op.gte]: filters.range.min },
        price: { [Op.lte]: filters.range },
    }

    if (filters.search) {
        searchConditions.question = { [Op.like]: `%${filters.search}%` }
    }

    let payload = null

    if (token) {
        payload = parseToken(token)
    }

    if (payload) {
        searchConditions.userId = { [Op.ne]: payload.id }
    }

    const totalCount = await Bet.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const orderBy =
        filters.orderBy === "Z-A" ? [["question", "DESC"]] : [["question", "ASC"]]

    const bets = await Bet.findAll({
        where: searchConditions,
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
        order: filters.orderBy,
        limit: limit,
        offset: offset,
    })
    const parsedBets = bets
        .map(item => item.toJSON() as any)
        .map(item => ({
            ...item,
            User: {
                ...item.User,
                image: item.User.image
                    ? parseFile(item.User.image)
                    : item.User.image,
            },
        }))

    return {
        parsedBets,
        page,
        totalPages,
        totalCount,
    }
}

//GET ALL MY BETS
export const getAllMyBets = async (
    body: Partial<BetPageDto>,
    userId: number
) => {
    const filters: any = {
        page: body?.page ?? 1,
    }

    const page = parseInt(filters.page || "1")
    const limit = 4
    const offset = (page - 1) * limit

    const searchConditions: any = {
        userId: userId,
    }
    const totalCount = await Bet.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const bets = await Bet.findAll({
        where: searchConditions,
        attributes: {
            exclude: ["createdAt", "updatedAt", "userId", "deletedAt"],
        },
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })

    const parsedBets = await Promise.all(
        bets
            .map(item => item.toJSON() as any)
            .map(async item => ({
                ...item,
                totalAcceptedCount: await BetSubscription.count({
                    where: {
                        betId: item.id,
                        status: "payed",
                    },
                }),
                User: {
                    ...item.User,
                    image: item.User.image
                        ? parseFile(item.User.image)
                        : item.User.image,
                },
            }))
    )

    return { bets: parsedBets, page, totalPages, totalCount }
}

//GET BET BY ID (NO NECESITAN ROL)
export const getBetById = async (id: number, userId: number) => {
    const bet: any = await Bet.findOne({
        where: { id: id },
        attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })

    if (!bet) {
        throw new BetNotFoundException()
    }

    if (bet.dataValues.status !== "active") {
        if (bet.dataValues.userId !== userId) {
            throw new BetNotFoundException()
        }
    }

    const isJoined =
        (await BetSubscription.count({
            where: { susbscriptorId: userId, betId: id },
        })) > 0

    const parsedBet = {
        totalAcceptedCount: await BetSubscription.count({
            where: {
                betId: bet.id,
                status: "payed",
            },
        }),
        isJoined,
        isOwner: bet.userId === userId,
        ...bet.toJSON(),
        User: {
            ...bet.toJSON().User,
            image: bet.toJSON().User.image
                ? parseFile(bet.toJSON().User.image)
                : bet.toJSON().User.image,
        },
    }

    return parsedBet
}

//GET ALL BETS BY USER ID (NO NECESITAN ROL)
export const getAllBetsByUserId = async (
    id: number,
    body: Partial<BetPageDto>
) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }

    const filters: any = {
        page: body?.page ?? 1,
    }

    const page = parseInt(filters.page || "1")
    const limit = 4
    const offset = (page - 1) * limit

    const searchConditions: any = {
        status: "active",
        userId: id,
    }
    const totalCount = await Bet.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const bets = await Bet.findAll({
        where: searchConditions,
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        limit: limit,
        offset: offset,
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })

    const parsedBets = await Promise.all(
        bets
            .map(item => item.toJSON() as any)
            .map(async item => ({
                ...item,
                totalAcceptedCount: await BetSubscription.count({
                    where: {
                        betId: item.id,
                        status: "payed",
                    },
                }),
                User: {
                    ...item.User,
                    image: item.User.image
                        ? parseFile(item.User.image)
                        : item.User.image,
                },
            }))
    )
    return { bets: parsedBets, page, totalPages, totalCount }
}

/* //GET BET BY USER ID
export const getBetsByUserId = async (id: number) => {
    const user = await User.findOne({ where: { id: id } })
    if (!user) {
        throw new UserNotFoundException()
    }
    const bet: any = await Bet.findOne({
        where: { userId: id, status: true },
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })
    if (!bet) {
        throw new BetNotFoundException()
    }
    const parsedBet = {
        ...bet.toJSON(),
        User: {
            ...bet.toJSON().User,
            image: bet.toJSON().User.image
                ? parseFile(bet.toJSON().User.image)
                : bet.toJSON().User.image,
        },
    }

    return parsedBet
}  */

/*  //GET BET BY WITHDRAW ID
export const getBetsByWithdrawId = async (id: number) => {
    const withdraw = await Withdraw.findOne({ where: { id: id, status: true } })
    if (!withdraw) {
        throw new WithdrawNotFoundException()
    }
    const bet: any = await Bet.findOne({
        where: { id: withdraw.betId, status: true },
        attributes: {
            exclude: [
                "createdAt",
                "updatedAt",
                "userId",
                "deletedAt",
                "status",
            ],
        },
        include: {
            model: User,
            attributes: {
                exclude: [
                    "lastname",
                    "dateOfBirth",
                    "phone",
                    "country",
                    "studies",
                    "laboralExperience",
                    "email",
                    "password",
                    "banner",
                    "video",
                    "status",
                    "createdAt",
                    "updatedAt",
                    "deletedAt",
                    "profileId",
                ],
            },
        },
    })
    if (!bet) {
        throw new BetNotFoundException()
    }
    const parsedBet = {
        ...bet.toJSON(),
        User: {
            ...bet.toJSON().User,
            image: bet.toJSON().User.image
                ? parseFile(bet.toJSON().User.image)
                : bet.toJSON().User.image,
        },
    }

    return parsedBet
}  */

/* //PUT BET BY ID
export const putBetById = async (id: number, body: Partial<BetDto>) => {
    const bet = await Bet.update(body, { where: { id: id } })
    if (bet[0] <= 0) {
        throw new BetNotFoundException()
    }
} */

//PUT DECIDE BET BY ID (ROL ADMIN)
export const putBetAnswerById = async (id: number, body: BetAnswerDto) => {
    const betToUpdate = await Bet.findOne({
        where: { id: id, answer: body.answer },
    })
    if (betToUpdate !== null) {
        throw new CannotCreateException()
    }

    const bet = await Bet.update(body, { where: { id: id } })
    if (bet[0] <= 0) {
        throw new BetNotFoundException()
    }

    const winners = await BetSubscription.findAll({
        where: { vote: body.answer, betId: id },
    })

    if (winners.length <= 0) {
        return
    }

    const withdraws = winners.map(winner => {
        return {
            date: new Date(),
            title: winner.title,
            betId: winner.betId,
            winnerId: winner.susbscriptorId,
        }
    })

    Withdraw.bulkCreate(withdraws)
}

//PUT BET STATUS BY ID (ROL ADMIN)
export const putBetStatusById = async (id: number, body: BetStatusDto) => {
    const betStatus = await Bet.findOne({
        where: { id: id },
    })
    if (!betStatus) {
        throw new CannotCreateException()
    }

    const bet = await Bet.update(body, { where: { id: id } })
    if (bet[0] <= 0) {
        throw new BetNotFoundException()
    }
}

//DEL BET BY ID
export const deleteBetById = async (id: number, userId: number) => {
    const betToDelete = await Bet.findOne({
        where: { id: id },
    })

    if (!betToDelete || betToDelete.endDate <= new Date()) {
        throw new CannotDeleteBetException()
    }

    if (betToDelete.userId != userId) {
        throw new CannotDeleteOthersBetException()
    }

    const betSubscription = await BetSubscription.count({
        where: { betId: betToDelete.id, status: "payed" },
    })
    if (betSubscription > 0) {
        throw new CannotDeleteBetException()
    }
    const bet = await Bet.destroy({ where: { id: id } })
    if (bet <= 0) {
        throw new BetNotFoundException()
    }
}
