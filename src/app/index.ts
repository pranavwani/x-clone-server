import { ApolloServer } from '@apollo/server'
import { expressMiddleware } from '@apollo/server/express4'
import express, { json } from 'express'
import cors from 'cors'
import { User } from "./user";

export async function initServer() {
    const app = express()

    app.use(cors())

    const server = new ApolloServer({
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

    app.use('/graphql', json(), expressMiddleware(server))

    return app
}