import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express, { json } from 'express'
import cors from 'cors'
import { User } from "./user";
import {GraphqlContext} from "../interfaces";
import JWTService from "../services/jwt";
import {Post} from "./post";

export async function initServer() {
    const app = express()

    app.use(cors())

    const server = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
            ${Post.types}
        
            type Query {
                ${User.queries},
                ${Post.queries}
            }
            
            type Mutation {
                ${Post.mutations},
                ${User.mutations}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries,
                ...Post.resolvers.queries
            },
            Mutation: {
                ...Post.resolvers.mutations,
                ...User.resolvers.mutations
            },
            ...User.resolvers.extraResolvers,
            ...Post.resolvers.extraResolvers
        }

    })

    await server.start()

    app.use('/graphql', json(), expressMiddleware(server, {
        context: async ({req, res}) => {
            return {
                user: req.headers.authorization ? JWTService.decodeToken(req.headers.authorization?.split(" ")[1]) : undefined
            }
        }
    }))

    return app
}