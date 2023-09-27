export const queries = `#graphql
    getAllPosts: [Post]
    getSignedURLForPost(imageName: String!, imageType: String!): String
`