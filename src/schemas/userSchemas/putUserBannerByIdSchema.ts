import Joi from "joi"
import { PutUserBannerByIdRequestDto } from "../../dto/userDtos/userBannerDto"
export default Joi.object<PutUserBannerByIdRequestDto>({
    banner: Joi.string(),
})
