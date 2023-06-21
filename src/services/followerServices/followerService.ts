import {
    FollowerDto,
    FollowerPageLimitDto,
} from "../../dto/followerDtos/followerDto"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import FollowerNotFoundException from "../../errors/followerErrors/FollowerNotFoundException"
import FollowingNotFoundException from "../../errors/followerErrors/FollowingNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import Follower from "../../models/followerModel/Follower"
import User from "../../models/userModels/User"

//POST FOLLOWER (listo)
export const postFollower = async (body: FollowerDto, userId: number) => {
    if (userId === body.followingId) {
        throw new UserSameIdException()
    }
    const followingUser = await User.findOne({
        where: { id: body.followingId },
    })

    if (!followingUser) {
        throw new FollowingNotFoundException()
    }

    const [newFollower, created] = await Follower.findOrCreate({
        where: { followerId: userId, followingId: body.followingId },
        defaults: { ...body },
    })

    if (!created) {
        throw new CannotCreateException()
    }
    return newFollower
}

//DELETE FOLLOWING (unfollow a person)
export const deleteFollowing = async (followingId: number, userId: number) => {
    if (userId === followingId) {
        throw new UserSameIdException()
    }

    const deletedCount = await Follower.destroy({
        where: {
            followerId: userId,
            followingId: followingId,
        },
    })

    if (deletedCount === 0) {
        throw new FollowerNotFoundException()
    }

    return deletedCount
}

//DELETE FOLLOWER
export const deleteFollower = async (followerId: number, userId: number) => {
    if (userId === followerId) {
        throw new UserSameIdException()
    }

    const deletedCount = await Follower.destroy({
        where: {
            followerId: followerId,
            followingId: userId,
        },
    })

    if (deletedCount === 0) {
        throw new FollowerNotFoundException()
    }

    return deletedCount
}

//POST GET NUMBER OF FOLLOWING
export const getNumberOfFollowing = async (
    body: Partial<FollowerPageLimitDto>,
    userId: number
) => {
    const filters: any = {
        page: body?.page ?? 1,
        limitPerPage: body?.limitPerPage ?? 30,
    }

    const page = parseInt(filters.page || "1")
    const limit = filters.limitPerPage
    const offset = (page - 1) * limit

    const searchConditions: any = {
        followerId: userId,
    }

    const totalCount = await Follower.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const follower = await Follower.findAndCountAll({
        where: searchConditions,
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
    })

    return {
        follower,
        page,
        totalPages,
        numberOfFollowing: totalCount,
    }
}

//POST GET NUMBER OF FOLLOWER
export const getNumberOfFollower = async (
    body: Partial<FollowerPageLimitDto>,
    userId: number
) => {
    const filters: any = {
        page: body?.page ?? 1,
        limitPerPage: body?.limitPerPage ?? 30,
    }

    const page = parseInt(filters.page || "1")
    const limit = filters.limitPerPage
    const offset = (page - 1) * limit

    const searchConditions: any = {
        followingId: userId,
    }

    const totalCount = await Follower.count({ where: searchConditions })
    const totalPages = Math.ceil(totalCount / limit)

    if (page > totalPages) {
        return []
    }

    const follower = await Follower.findAndCountAll({
        where: searchConditions,
        order: [["createdAt", "DESC"]],
        limit: limit,
        offset: offset,
    })

    return {
        follower,
        page,
        totalPages,
        numberOfFollower: totalCount,
    }
}
