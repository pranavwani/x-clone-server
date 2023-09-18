import jwt from "jsonwebtoken"
import {User} from "@prisma/client";
import {JWTUser} from "../interfaces";

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload: JWTUser = {
            id: user.id,
            email: user.email
        }

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string)
    }

    public static decodeToken(token: string) {
        try {
            return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string)
        } catch (e) {
            return null
        }
    }
}

export default JWTService