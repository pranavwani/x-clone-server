export const types = `#graphql
    input CreatePostData {
        content: String!
        imageURL: String
        parentPostID: ID
    }
    
    type Post {
        id: ID!
        content: String!
        imageURL: String
        author: User
        parentPostID: ID
        replies: [Post]
    }
`