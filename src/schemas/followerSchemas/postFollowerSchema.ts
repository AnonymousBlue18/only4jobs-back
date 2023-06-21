import Joi from "joi"
import { FollowerDto } from "../../dto/followerDtos/followerDto"

export default Joi.object<FollowerDto>({
    followingId: Joi.number().required(),
})
