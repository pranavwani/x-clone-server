import jwt from "jsonwebtoken"
import {User} from "@prisma/client";

class JWTService {
    public static generateTokenForUser(user: User) {
        const payload = {
            id: user.id,
            email: user.email
        }

        return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET as string)
    }
}

export default JWTService