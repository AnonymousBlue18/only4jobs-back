import jwt from "jsonwebtoken"
import config from "../config"
import { TokenPayload } from "../interfaces/utils/Utils"

export const parseToken = (token: string): TokenPayload | null => {
    const validation = token.split(" ")[1]
    if (!validation) {
        return null
    }
    const parsedToken = jwt.verify(
        validation,
        config.KEY
    ) as TokenPayload | null
    if (!parsedToken || !("id" in parsedToken)) {
        return null
    }

    return parsedToken
}
