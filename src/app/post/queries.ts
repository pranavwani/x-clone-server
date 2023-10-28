export const queries = `#graphql
    getAllPosts: [Post]
    getSignedURLForPost(imageName: String!, imageType: String!): String
    getPostByID(id: ID!): [Post]
    getPostsWithReplies(authorID: ID!): [Post]
`