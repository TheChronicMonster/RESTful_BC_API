const SHA256 = require('crypto-js/sha256');
const levelDB = require('./level.js');
const chainDBForLevelDBRef = levelDB.getDBReference();

// Block Class holding Block constructor
class Block {
    constructor(data) {
        this.hash = '',
        this.height = 0,
        this.body = data,
        this.time = 0,
        this.previousBlockHash = ''
    }
}

// Blockchain Class
class Blockchain {
    // Blockchain Constructor
    constructor() {
        this.getBlockHeight().then((height) => {
            // Create Genesis Block if block height is zero
            if (height === 0) {
                this.addBlock(new Block("Blockchain Initiated: Genesis Block"));
                console.log("\nGenesis Block Created");
            }
        })
    }

    // Create and add New Blocks
    addBlock(newBlock) {
        return new Promise((res, rej) => {
            let self = this;
            this.getBlockHeight().then((height) => {
                // Block height
                newBlock.height = (height);
                // UTC timestamp
                newBlock.time = new Date().getTime().toString().slice(0, -3);
                // Block hash with SHA256 using newBlock and convert to string
                newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                if (newBlock.height > 0) {
                    self.getBlock(height - 1).then((response) => {
                        newBlock.previousBlockHash = JSON.parse(response).hash;
                        // Store new block in database
                        levelDB.addLevelDBData(height, newBlock);
                        res(JSON.stringify(newBlock));
                        console.log("Block " + newBlock.height + " has been added to the blockchain.");
                    });
                } else {
                    // Block hash with SHA256 using newBlock and convert to string
                    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();
                    // Store new block in database
                    //levelDB.addLevelDBData(newBlock.height, JSON.stringify(newBlock).toString());
                    levelDB.addLevelDBData(height, newBlock);
                    res(JSON.stringify(newBlock));
                }
            })
        });
    }

    // Get Block
    getBlock(blockHeight) {
        return levelDB.getLevelDBData(blockHeight);
    }

    // Get Block Height
    getBlockHeight() {
        return new Promise((resolve, reject) => {
            // Begin block height at index 0
            let height = 0;
            // CHANGE DB TO CHAINDB
            chainDBForLevelDBRef.createReadStream()
              .on('data', (data) => {
                  height++;
              })
              .on('error', () => {
                  reject(error);
              })
              .on('close', () => {
                  resolve(height);
                  //console.log("Current Block Height is: " +  height);
              });
        });
    }

    // Validate Block
    validateBlock(blockHeight) {
        levelDB.validateLevelDBBlock(blockHeight, function(isValid) {
            if (isValid) {
                console.log('Block ' + blockHeight + ' is valid');
            } else {
                console.log('Block ' + blockHeight + ' is not valid');
            }
        });
    }

    // Validate entire Blockchain
    validateChain() {
        let errorLog = [];
        let chain = [];
        let i = 0;
        chainDBForLevelDBRef.createReadStream().on('data', function(data) {
            // Validate Block
            levelDB.validateLevelDBBlock(i, function(value) {
                if (!value) {
                    errorLog.push(i);
                }
            });
            chain.push(data.value);
            i++;
        })
        .on('error', function (err) {
            console.log('Error: ', err);
        })
        .on('close', function() {
            for (var i=0; i < chain.length - 1; i++) {
                // Compare block hash
                let blockHash = JSON.parse(chain[i]).hash;
                let previousHash = JSON.parse(chain[i+1]).previousBlockHash;
                if (blockHash !== previousHash) {
                    errorLog.push(i);
                }
            }
            if (errorLog.length > 0) {
                console.log('Block errors = ' + errorLog.length);
                console.log('Blocks: ' + errorLog);
            } else {
                console.log('Chain Valid; No errors detected');
            }
        });
    }
}

// Used to create POST requests with Node/Express Endpoints
let POSTBlockHelper = (body) => blockchain.addBlock(new Block(body.toString()));

// I know this violates DRY, bad coding practice, but had a difficult time getting routes.js to recognize blockchain.getBlock as a function.
// Reviewer advice in overcoming that would be highly appreciated
function getBlock2(blockHeight) {
    return levelDB.getLevelDBData(blockHeight);
};

const blockchain = new Blockchain()

module.exports.Blockchain = Blockchain;
module.exports = {getBlock2, Blockchain, POSTBlockHelper};

/* --------------------------------------- //
// Use this to generate 10 blocks       //
// --------------------------------------- */


(function theLoop(i) {
    setTimeout(function() {
        let blockTest = new Block("Test Block");
        blockchain.addBlock(blockTest)
            i++;
            if (i < 5) theLoop(i);
    }, 900);
  })(0);
