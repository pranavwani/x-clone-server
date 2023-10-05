import {prismaClient} from "../clients/db";

export interface CreatePostData {
    content: string
    imageURL?: string
    userID: string
}

export default class PostService {
    public static async getAllPosts() {
        return prismaClient.post.findMany({ orderBy: { createdAt: "desc" } })
    }

    public static async createPost(payload: CreatePostData) {
        return prismaClient.post.create({
            data: {
                content: payload.content,
                imageURL: payload.imageURL,
                author: { connect: { id: payload.userID }}
            }
        })
    }

    public static async getPostsByAuthorID(authorID: string) {
        return prismaClient.post.findMany({ where: { authorID }})
    }
}