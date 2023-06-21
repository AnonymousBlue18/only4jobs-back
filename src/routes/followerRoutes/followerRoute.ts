import { Router } from "express"
import {
    deleteFollower,
    deleteFollowing,
    getNumberOfFollower,
    getNumberOfFollowing,
    postFollower,
} from "../../controllers/followerControllers/followerController"
import { FollowerDto } from "../../dto/followerDtos/followerDto"
import { authentication } from "../../middlewares/authentication"
import { validatorBody, validatorParams } from "../../middlewares/validator"
import getFollowerByIdSchema from "../../schemas/followerSchemas/getFollowerByIdSchema"
import postFollowerPageLimitSchema from "../../schemas/followerSchemas/postFollowerPageLimitSchema"
import postFollowerSchema from "../../schemas/followerSchemas/postFollowerSchema"

const followerRouter = Router()

//ROUTES

//POST FOLLOWER
followerRouter.post(
    "/followers",
    validatorBody(postFollowerSchema),
    authentication(),
    postFollower
)

//DELETE FOLLOWING (unfollow a person)
followerRouter.delete<any, FollowerDto>(
    "/followers/following/:id",
    validatorParams(getFollowerByIdSchema),
    authentication(),
    deleteFollowing
)

//DELETE FOLLOWER
followerRouter.delete<any, FollowerDto>(
    "/followers/follower/:id",
    validatorParams(getFollowerByIdSchema),
    authentication(),
    deleteFollower
)

//POST GET NUMBER OF FOLLOWING
followerRouter.post<any, FollowerDto>(
    "/followers/number/following",
    validatorBody(postFollowerPageLimitSchema),
    authentication(),
    getNumberOfFollowing
)

//POST GET NUMBER OF FOLLOWER
followerRouter.post<any, FollowerDto>(
    "/followers/number/follower",
    validatorBody(postFollowerPageLimitSchema),
    authentication(),
    getNumberOfFollower
)

export default followerRouter
