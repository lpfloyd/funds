const BlockchainService = require("../blockchain.service");
const { createIncomingDeposit, getAllUsersAddress, updateExistingDeposits } = require("../../utils/dbutils");

module.exports = class VechainService extends BlockchainService {
    constructor(web3, confirmations) {
        super(web3, confirmations);
        this._token = 'VET';
        this._name = 'Vechain';
        this.setupWallet();
        this.setupBlockWatchService();
    }
    
    async setupWallet() {
        // get all users with their addresses
        for (var wallet of await getAllUsersAddress(this.token)) {
            this.addWallet(wallet);
        }

        console.log(this.wallets);
    }

    async setupBlockWatchService() {
        // Create block header subscription
        const subscription = this.web3.eth.subscribe("newBlockHeaders");

        // Subscription service on receive data
        subscription.on("data", ({
            transactions,
            number,
        }) => {
            // wait for 12 confirmations before updating
            updateExistingDeposits(number - this.confirmation, this.token);

            // iterate tx to create new deposits
            for (var tx of transactions)
                this.createTransaction(tx, number, this.token);
        });
    }

    createTransaction(tx, blockNumber) {
        this.web3.eth.getTransaction(tx)
            .then(({
                clauses,
                origin,
                id
            }) => {
                // create the deposits from the clauses
                for (var clause of clauses)
                    this.createClause(clause, origin, id, blockNumber);
            })
            .catch(err => console.error(err));
    }

    createClause(clause, sender, txid, blockNumber) {
        // destructure
        const { to, value } = clause;

        // check if the address exists and then create a deposit
        if (this.wallets[to]) {
            const amount = parseFloat(value, 10) / 1e18;
            createIncomingDeposit(sender, to, amount, this.token, txid, blockNumber);
        }
    }
}