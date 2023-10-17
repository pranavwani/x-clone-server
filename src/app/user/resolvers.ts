import {User} from "@prisma/client";
import {GraphqlContext} from "../../interfaces";
import UserService from "../../services/user";
import PostService from "../../services/post";
import {prismaClient} from "../../clients/db";

const queries = {
    verifyGoogleToken: async (parent: any, {token}: { token: string }) => {
        return UserService.verifyGoogleAuthToken(token)
    },
    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {

        const id = ctx.user?.id

        if (!id) return null;

        return UserService.getUserByID(id);
    },
    getUserByID: async (parent: any, {id}: { id: string }) => {
        if (!id) return null

        return UserService.getUserByID(id)
    }
}

const mutations = {
    followUser: async (parent: any, {followingID}: { followingID: string }, ctx: GraphqlContext) => {
        if (!ctx.user?.id) throw new Error("Unauthenticated")
        await UserService.followUser(ctx.user.id, followingID)
        return true
    },
    unfollowUser: async (parent: any, {followingID}: { followingID: string }, ctx: GraphqlContext) => {
        if (!ctx.user?.id) throw new Error("Unauthenticated")
        await UserService.unfollowUser(ctx.user.id, followingID)
        return true
    }
}

const extraResolvers = {
    User: {
        posts: (parent: User) => PostService.getPostsByAuthorID(parent.id),
        followers: async (parent: User) => {
            const result = await UserService.followers(parent.id)

            return result.map(record => record.follower)
        },
        following: async (parent: User) => {
            const result = await UserService.following(parent.id)

            return result.map(record => record.following)
        },
        recommendedUsers: async (parent: any, args: any, ctx: GraphqlContext) => {
            if (!ctx.user?.id) return null

            return UserService.recommendedUsers(ctx.user.id)
        }
    }
}

export const resolvers = {queries, extraResolvers, mutations}