import Joi from "joi"
import { PutUserImageByIdRequestDto } from "../../dto/userDtos/userImageDto"
export default Joi.object<PutUserImageByIdRequestDto>({
    image: Joi.string(),
})
