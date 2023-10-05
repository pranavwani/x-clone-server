import {User} from "@prisma/client";
import {GraphqlContext} from "../../interfaces";
import UserService from "../../services/user";
import PostService from "../../services/post";

const queries = {
    verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
        return UserService.verifyGoogleAuthToken(token)
    },
    getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext)=> {

        const id = ctx.user?.id

        if (!id) return null;

        return UserService.getUserByID(id);
    },
    getUserByID: async (parent: any, { id }: { id: string })=> {
        if (!id) return null

        return UserService.getUserByID(id)
    }
}

const extraResolvers = {
    User: {
        posts: (parent: User) => PostService.getPostsByAuthorID(parent.id)
    }
}

export const resolvers = { queries, extraResolvers }