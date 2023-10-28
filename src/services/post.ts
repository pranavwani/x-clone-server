import {prismaClient} from "../clients/db";

export interface CreatePostData {
    content: string
    imageURL?: string
    userID: string
    parentPostID?: string
}

export default class PostService {
    public static async getAllPosts() {
        return prismaClient.post.findMany({
            where: {
                parentPostID: {
                    equals: null
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        })
    }

    public static async createPost(payload: CreatePostData) {
        const post: any = {
            content: payload.content,
            imageURL: payload.imageURL,
            author: {connect: {id: payload.userID}},
            parentPost: null
        }

        if (payload?.parentPostID) post.parentPost = {connect: {id: payload.parentPostID}}

        return prismaClient.post.create({
            data: post
        })
    }

    public static async getPostsByAuthorID(authorID: string) {
        return prismaClient.post.findMany({
            where: {authorID, parentPostID: {equals: null}},
            orderBy: {createdAt: "desc"}
        })
    }

    public static async getPostByID(id: string) {
        return prismaClient.post.findMany({
            where: {
                id
            },
            include: {
                author: true,
                replies: true
            }
        })
    }

    public static async getPostsWithReplies(authorID: string) {
        return prismaClient.post.findMany({
            where: {
                replies: {
                    some: {
                        parentPostID: {
                            not: null
                        },
                        authorID
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            },
            select: {
                id: true,
                content: true,
                imageURL: true,
                replies: true,
                author: true,
                authorID: true
            }
        });
    }
}