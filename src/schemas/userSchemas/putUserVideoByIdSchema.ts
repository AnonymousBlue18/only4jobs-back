import Joi from "joi"
import { PutUserVideoByIdRequestDto } from "../../dto/userDtos/userVideoDto"
export default Joi.object<PutUserVideoByIdRequestDto>({
    video: Joi.string(),
})
