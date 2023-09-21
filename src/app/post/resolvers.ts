import {GraphqlContext} from "../../interfaces";
import { prismaClient } from "../../clients/db";
import {Post} from "@prisma/client";

interface CreatePostData {
    content: string
    imageURL?: string
}

const queries = {
    getAllPosts: () => prismaClient.post.findMany({ orderBy: { createdAt: "desc" } })
}

const mutations= {
    createPost: async (parent: any, { payload }: { payload: CreatePostData }, ctx: GraphqlContext)=> {
        if (!ctx.user) throw new Error("You are not authenticated");
        return prismaClient.post.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: ctx.user.id } }
            }
        });
    }
}

const extraResolvers = {
    Post: {
        author: (parent: Post) => prismaClient.user.findUnique({ where: { id: parent.authorID } })
    }
}
export const resolvers = { mutations, queries, extraResolvers }