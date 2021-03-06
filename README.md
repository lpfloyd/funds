# Funds

This application form the base files of the withdraw/deposit service. Currently being rewritten in GoLang instead.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

This guide will assume that you have already installed node and it's dependencies globally on your machine. However, we do recommend that yarn is used instead of npm, therefore the following setup will be for yarn configurations. With that being said, it should still be able to work with npm.

### Installing

A step by step series of examples that tell you how to get a development env running
The server and the client will run independently.

Installing the server
```
cd server
yarn
```

## Running the tests

Essentially we are running Mocha and Chai for the backend test's.

```
cd server
yarn test
```

## Essential knowledge to understand how this service works
  * This is achieved through the management of serverSeed and hostServer, whereby the serverSeed is created at project inception
    * We can arbritarily generate a list of N serverSeeds through a seeding event
    * N must be large as 1e7 when in production
* Management of user accounts
  * Hierarchical Deterministic keys
* Deposit and Withdrawal
    * For development enviroment, we create a service that subscribe's to the transfer of each account
      * O(N), where N is the number of acccounts in the system
      * This is really slow onces N > M
    * For production enviroment, we subscribe to the block service and check clauses if the user's account has a deposit/withdrawal
      * O(M), where M is the number of transaction in the system
      * Also, the number of confirmations is an arbritray number that can be set to 1 if you want fast confirmation times
      * Note, current max TPS reached on Vechain = ~110 TPS 
* Vechain Thor, Ethereum
  * Initial blockchain that we are running the application on
  * It's important to understand the difference between Ethereum and Vechain's transaction
    * Specifically how clauses work in Vechain
   
    
## Built With
Essentially we are using MERN stack as the basis of the application. 

* [MongoDB](https://www.mongodb.com/) - NoSQL database
* [ExpressJS](https://expressjs.com/) - Web framework for NodeJS
* [NodeJS](https://nodejs.org/en/) - The Javascript runtime library
* [GraphQL](https://graphql.org/) - The API framework used
