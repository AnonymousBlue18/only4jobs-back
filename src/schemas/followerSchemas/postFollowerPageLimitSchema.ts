import Joi from "joi"
import { FollowerPageLimitDto } from "../../dto/followerDtos/followerDto"

export default Joi.object<Partial<FollowerPageLimitDto>>({
    page: Joi.number(),
    limitPerPage: Joi.number(),
})
