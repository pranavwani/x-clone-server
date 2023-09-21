export const types = `#graphql
    type User {
        id: String!
        firstName: String!
        lastName: String
        email: String!
        profileImageUrl: String
        posts: [Post]
    }
`