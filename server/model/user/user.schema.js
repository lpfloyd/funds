const { gql } = require("apollo-server");

const user = gql`
  extend type Query {
    getCurrentUser: User
  }

  extend type Mutation {
    register(username: String!, email: String!, password: String!): AuthToken
    login(username: String!, password: String!): AuthToken
  }

  type AuthToken {
    token: String!
  }

  type User {
    _id: ID
    username: String!
    password: String!
    email: String!
    joinDate: String
    tokens: [Token]
  }
`;

module.exports = user;
