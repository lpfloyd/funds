'use strict';

// NodeJS dependencies Imports
const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const chalk = require("chalk");

// Connections
const MongooseConnection = require('./db');
const GraphQLConnection = require('./api');

// Configure Chalk
const error = chalk.bold.red;
const success = chalk.bold.green;
const environment = chalk.bold.blue;

// Environment
const { PORT, NODE_ENV } = require("./environment");

// initialise application
const app = express();
const db = new MongooseConnection();

// Setup vechain and graphql services
db.setupMongoDBService().then(({ vechain }) => {
  console.log(success(`Connected to ${environment("Vechain Thor")}`));
  const gql = new GraphQLConnection(vechain);
  gql.server.applyMiddleware({ app })
  console.log(success(`API connection setup through to ${environment("GraphQL")}`));
});

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

// Listen to the Port
app.listen(PORT, () => {
  console.log(
    success(
      `Server listening on ${environment("PORT " + PORT + ": " + NODE_ENV)}`
    )
  );
});
