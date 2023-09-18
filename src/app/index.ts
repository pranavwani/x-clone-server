import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express, { json } from 'express'
import cors from 'cors'
import { User } from "./user";
import {GraphqlContext} from "../interfaces";
import JWTService from "../services/jwt";

export async function initServer() {
    const app = express()

    app.use(cors())

    const server = new ApolloServer<GraphqlContext>({
        typeDefs: `
            ${User.types}
        
            type Query {
                ${User.queries}
            }
        `,
        resolvers: {
            Query: {
                ...User.resolvers.queries
            }
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