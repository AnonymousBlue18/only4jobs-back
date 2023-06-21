import { Request, Response } from "express"
import {
    FollowerDto,
    FollowerPageLimitDto,
    FollowerParamsDto,
    FollowerUserTokenDto,
} from "../../dto/followerDtos/followerDto"
import CannotCreateException from "../../errors/cannotErrors/CannotCreateException"
import FollowerNotFoundException from "../../errors/followerErrors/FollowerNotFoundException"
import FollowingNotFoundException from "../../errors/followerErrors/FollowingNotFoundException"
import UserSameIdException from "../../errors/userErrors/UserSameIdException"
import { Response as ResponseDictionary } from "../../interfaces/utils/Dictionary"
import {
    deleteFollower as deleteFollowerService,
    deleteFollowing as deleteFollowingService,
    getNumberOfFollower as getNumberOfFollowerService,
    getNumberOfFollowing as getNumberOfFollowingService,
    postFollower as postFollowerService,
} from "../../services/followerServices/followerService"

//POST FOLLOWER
export const postFollower = async (req: Request, res: Response) => {
    try {
        const body: FollowerDto = req.body
        await postFollowerService(body, Number(req.params.userTokenId))
        res.status(201).json({
            message: ResponseDictionary.CREATED,
        })
    } catch (error) {
        console.error(error)
        if (error instanceof UserSameIdException) {
            res.status(400).json({
                message: ResponseDictionary.USER_SAME_ID,
            })
            return
        }

        if (error instanceof FollowingNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.FOLLOWING_NOT_FOUND,
            })
            return
        }
        if (error instanceof CannotCreateException) {
            res.status(500).json({
                message: ResponseDictionary.CANNOT_CREATE,
            })
            return
        }

        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//DELETE FOLLOWING (unfollow a person)
export const deleteFollowing = async (
    req: Request<FollowerParamsDto>,
    res: Response
) => {
    try {
        const params: FollowerParamsDto = req.params

        await deleteFollowingService(params.id, Number(params?.userTokenId))
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof UserSameIdException) {
            res.status(400).json({
                message: ResponseDictionary.USER_SAME_ID,
            })
            return
        }
        if (error instanceof FollowerNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.FOLLOWING_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//DELETE FOLLOWER
export const deleteFollower = async (
    req: Request<FollowerParamsDto>,
    res: Response
) => {
    try {
        const params: FollowerParamsDto = req.params

        await deleteFollowerService(params.id, Number(params?.userTokenId))
        res.status(200).json({
            message: ResponseDictionary.DELETE,
        })
    } catch (error) {
        console.error(error)

        if (error instanceof UserSameIdException) {
            res.status(400).json({
                message: ResponseDictionary.USER_SAME_ID,
            })
            return
        }
        if (error instanceof FollowerNotFoundException) {
            res.status(404).json({
                message: ResponseDictionary.FOLLOWER_NOT_FOUND,
            })
            return
        }
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//POST GET NUMBER OF FOLLOWING
export const getNumberOfFollowing = async (
    req: Request<FollowerUserTokenDto>,
    res: Response
) => {
    try {
        const params: FollowerUserTokenDto = req.params
        const body: FollowerPageLimitDto = req.body
        const followers = await getNumberOfFollowingService(
            body,
            Number(params?.userTokenId)
        )
        res.status(200).json({
            data: followers,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}

//POST GET NUMBER OF FOLLOWER
export const getNumberOfFollower = async (
    req: Request<FollowerUserTokenDto>,
    res: Response
) => {
    try {
        const params: FollowerUserTokenDto = req.params
        const body: FollowerPageLimitDto = req.body
        const followers = await getNumberOfFollowerService(
            body,
            Number(params?.userTokenId)
        )
        res.status(200).json({
            data: followers,
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({
            message: ResponseDictionary.SERVER_ERROR,
        })
    }
}
