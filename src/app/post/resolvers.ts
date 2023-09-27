import {Post} from "@prisma/client";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import {GraphqlContext} from "../../interfaces";
import { prismaClient } from "../../clients/db";

interface CreatePostData {
    content: string
    imageURL?: string
}

const UNAUTHENTICATED = "Unauthenticated"

const s3Client = new S3Client({
    region: process.env.AWS_S3_REGION,
    credentials: {
        accessKeyId: process.env.AWS_S3_ACCESS_KEY as string,
        secretAccessKey: process.env.AWS_S3_SECRET_KEY as string
    }
})

const queries = {
    getAllPosts: () => prismaClient.post.findMany({ orderBy: { createdAt: "desc" } }),
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