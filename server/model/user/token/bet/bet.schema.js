const { gql } = require("apollo-server");

const bet = gql`
  type Bet {
    _id: String!
    amount: Int!
    time: String
    bonus: Int
    multiplier: Float!
    status: Boolean
    address: String!
    hash: String!
  }

  extend type Mutation {
    createBet(
      address: String!
      amount: Int!
      hash: String!
      multiplier: Float!
    ): Bet

    closeBet(
      address: String!
      multiplier: Float!
    ): Bet

  }

  extend type Query {
    getAllBetsOfUser(username: String!, address: String!): [Bet]
  }
`;

module.exports = bet;
