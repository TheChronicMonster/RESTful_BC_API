const SHA256 = require('crypto-js/sha256');
const level = require('level');
const chainDB = './chaindata';
const db = level(chainDB);

// LevelDB to hold persistent blockchain data

// Get block height from LevelDB
function getHeightFromLevelDB(callback) {
    let i = 0;
    db.createReadStream().on('data', function(data) {
        i++;
    }).on('error', function(err) {
        console.log('Error found: ', err);
    }).on('close', function() {
        callback(i - 1);
    });
}

// Add data to levelDB with key/value pair
function addLevelDBData(key, value) {
    //console.log("Current key value is " + key)
    db.put(key, JSON.stringify(value), function(err) {
        if (err) return console.log('Block ' + key + ' submission failed', err);
    });
}

// Validate block in levelDB
function validateLevelDBBlock(key, callback) {
    getLevelDBData(key, function(value) {
        // Get block object
        let block = JSON.parse(value);
        // Get block hash
        let blockHash = block.hash;
        // Remove block hash to test block integrity
        block.hash = '';
        // Generate block hash
        let validBlockHash = SHA256(JSON.stringify(block)).toString();
        // Compare
        if (blockHash === validBlockHash) {
            callback(true);
        } else {
            callback(false);
            console.log('Block # ' + key + ' invalid hash:\n' + blockHash + '<>' + validBlockHash);
        }
    });
}

// Get Data from levelDb with key
function getLevelDBData(key) {
    return new Promise((res, rej) => {
        db.get(key, (err, value) => {
            if (err) {
                rej(err);
            } else {
                console.log('Value = ' + value);
                res(value);
            }
        })
    });
}

function getDBReference() {
    return db;
}

module.exports = {getHeightFromLevelDB, addLevelDBData, validateLevelDBBlock, getLevelDBData, getDBReference};