import {Post} from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {GraphqlContext} from "../../interfaces";
import PostService, {CreatePostData} from "../../services/post";
import UserService from "../../services/user";

const UNAUTHENTICATED = "Unauthenticated"

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION
})

const queries = {
    getAllPosts: () => PostService.getAllPosts(),

    getSignedURLForPost: async (parent: any, { imageName, imageType }: { imageName: string, imageType: string }, ctx: GraphqlContext) => {
        if (!ctx.user || !ctx.user.id) throw new Error(UNAUTHENTICATED);

        const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png", "image/webp"];

        if (!allowedImageTypes.includes(imageType)) throw new Error("Unsupported Image Type");

        const putObjectCommand = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET as string,
            Key: `uploads/${imageName}-${Date.now()}.${imageType}`
        })

        return getSignedUrl(s3Client, putObjectCommand)
    }
}

const mutations= {
    createPost: async (parent: any, { payload }: { payload: CreatePostData }, ctx: GraphqlContext)=> {

        if (!ctx.user || !ctx.user.id) throw new Error(UNAUTHENTICATED);

        return PostService.createPost({
            ...payload,
            userID: ctx.user.id
        })
    }
}

const extraResolvers = {
    Post: {
        author: (parent: Post) => UserService.getUserByID(parent.authorID)
    }
}

export const resolvers = { mutations, queries, extraResolvers }