export const queries = `#graphql
    verifyGoogleToken(token: String!): String
    getCurrentUser: User
    getUserByID(id: ID!): User
    getUserRelations(id: ID!): Relations
`