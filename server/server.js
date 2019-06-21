// NodeJS dependencies Imports
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");

// Blockchain imports
const Web3 = require("web3");
const Thorify = require("thorify").thorify;
const createBlockWatchService = require("./model/blockchain/subscriptions/block");
const createTransferWatchService = require("./model/blockchain/subscriptions/transfer");

// Import Mongoose and GraphQL essentials
const mongoose = require("mongoose");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./model/schemas");
const resolvers = require("./model/resolvers");
const [ 
  User, 
  Token, 
  Withdrawal, 
  Deposit, 
  Investment, 
  Bet, 
  GamesHash 
] = require("./model/models");

// Configure Chalk
const error = chalk.bold.red;
const success = chalk.bold.green;
const connection = chalk.bold.magenta;

// Configure PORT
require("dotenv").config({
  path: "variables.env"
});
const PORT = process.env.PORT || 4444;
const NODE_ENV = process.env.NODE_ENV || "development";
const THOR_NETWORK = process.env.THOR_NETWORK || "http://localhost:8669";

// connect to database
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    // Configure Vechain Thor Setup
    const web3 = Thorify(new Web3(), THOR_NETWORK);
    const TOKEN = "VET";
  
    // creating a deposit service
    if (NODE_ENV === "production")
      createBlockWatchService(web3, TOKEN);
    else
      createTransferWatchService(web3, TOKEN);

    // connected to DB
    console.log(success(`Connected to ${connection("MongoDB")}!`));

  })
  .catch(err => console.log(error(err)));

mongoose.set("useCreateIndex", true);

// initialise application
const app = express();

// Setup cors so that client can talk to back end
const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

// JWT authentication middleware
app.use(async (req, res, next) => {
  const token = req.headers["authorization"];
  if (token !== "null" && token !== undefined && token !== null) {
    try {
      const currentUser = await jwt.verify(token, process.env.SECRET);
      req.currentUser = currentUser;
    } catch (err) {
      console.log(error(err));
    }
  }
  next();
});

// Initialise ApolloServer with the associated typeDefs and resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({
    currentUser: req.currentUser,
    User,
    Token,
    Withdrawal,
    Deposit,
    Investment, 
    Bet, 
    GamesHash 
  })
});
server.applyMiddleware({ app })

// Listen to the Port
app.listen(PORT, () => {
  console.log(
    success(
      `Server listening on ${chalk.blue("PORT " + PORT)}: ${connection(
        NODE_ENV
      )}`
    )
  );
});
