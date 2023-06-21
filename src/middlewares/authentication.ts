import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import config from "../config"
import { Response as ResponseDictionary } from "../interfaces/utils/Dictionary"
import { ProfileEnum } from "../interfaces/utils/Profiles"
import User from "../models/userModels/User"

export const authentication =
    (rol?: ProfileEnum[]) =>
    async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.headers.authorization) {
                res.status(401).json({
                    message: ResponseDictionary.MISSING_TOKEN,
                })
                return
            }

            const token = req.headers.authorization.split(" ")[1]

            if (!config.KEY || !token || !jwt.verify(token, config.KEY)) {
                res.status(401).json({
                    message: ResponseDictionary.AUTHORIZATION_REQUIRED,
                })
                return
            }

            const jwtDecoded = jwt.decode(token)

            if (!(typeof jwtDecoded === "object") || !jwtDecoded) {
                res.status(401).json({
                    message: ResponseDictionary.INVALID_TOKEN,
                })
                return
            }

            const user = await User.findOne({
                where: { id: jwtDecoded.id },
            })

            if (!user || (rol && rol.every(item => item !== user.profileId))) {
                res.status(403).json({
                    message: ResponseDictionary.NOT_AUTHORIZATED,
                })
                return
            }
            req.params["userTokenId"] = String(jwtDecoded.id)
            next()
        } catch (error) {
            console.error(error)
            res.status(500).json({
                message: ResponseDictionary.SERVER_ERROR,
            })
        }
    }
