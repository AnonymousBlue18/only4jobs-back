import Joi from "joi"
import { FollowerDto } from "../../dto/followerDtos/followerDto"

export default Joi.object<Partial<FollowerDto>>({
    followerId: Joi.number(),
    followingId: Joi.number(),
})
