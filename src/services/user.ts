import axios from "axios";
import {prismaClient} from "../clients/db";
import JWTService from "./jwt";

interface GoogleTokenResult {
    iss?: string,
    azp?: string,
    aud?: string,
    sub?: string,
    email: string,
    email_verified?: string,
    nbf?: string,
    name?: string,
    picture?: string,
    given_name: string,
    family_name: string,
    locale?: string,
    iat?: string,
    exp?: string,
    jti?: string,
    alg?: string,
    kid?: string,
    typ?: string
}

export default class UserService {
    public static async verifyGoogleAuthToken(token: string) {
        const googleToken = token
        const googleOAuthURL = new URL(process.env.GOOGLE_OAUTH_URL as string)
        googleOAuthURL.searchParams.set("id_token", googleToken)

        const { data } = await axios.get<GoogleTokenResult>(googleOAuthURL.toString(), {
            responseType: "json"
        })

        const user = await prismaClient.user.findUnique({ where: { email: data.email }})

        if (!user) {
            await prismaClient.user.create({
                data: {
                    email: data.email,
                    firstName: data.given_name,
                    lastName: data.family_name,
                    profileImageUrl: data.picture
                }
            })
        }

        const userInDB = await prismaClient.user.findUnique({ where: { email: data.email }})

        if (!userInDB) throw new Error("User with email not found")

        return JWTService.generateTokenForUser(userInDB)
    }

    public static async getUserByID(id: string) {
        return prismaClient.user.findUnique({ where: { id } })
    }

    public static async followUser(followerID: string, followingID: string) {
        return prismaClient.follows.create({
            data: {
                follower: { connect: { id: followerID } },
                following: { connect: { id: followingID } }
            }
        })
    }

    public static async unfollowUser(followerID: string, followingID: string) {
        return prismaClient.follows.delete({
            where: {
                followerID_followingID: { followerID, followingID }
            }
        })
    }

    public static async followers(followingID: string) {
        return prismaClient.follows.findMany({
            where: {
                following: {
                    id: followingID
                }
            },
            select: {
                follower: true
            }
        })
    }

    public static async following(followerID: string) {
        return prismaClient.follows.findMany({
            where: {
                follower: {
                    id: followerID
                }
            },
            select: {
                following: true
            }
        })
    }
}