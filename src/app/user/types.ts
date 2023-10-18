export const types = `#graphql
    type User {
        id: String!
        firstName: String!
        lastName: String
        email: String!
        profileImageUrl: String
        
        posts: [Post]
        followers: [User]
        following: [User]
        recommendedUsers: [User]
        createdAt: String
    }
    
    type Relations {
        followers: [User]
        following: [User]
    }
`