// Acknowledge https://www.codementor.io/wapjude/creating-a-simple-rest-api-with-expressjs-in-5min-bbtmk51mq

// Break up levelDB and require it
let levelDB = require('./level.js')
// Break up Blockchain Class and require it
let blockchain = require('./blockchain.js');

let appRouter = function(app) {
    app.get('/', function(req,res) {
        res.status(200).send("Private Blockchain home. To explore blocks, GET localhost:8000/block/{block #}");
    });
    // Created with grateful assistance from Jose M
    // https://knowledge.udacity.com/questions/10391
    app.get("/block/:key", (req, res) => {
        if (req.params.key) {
            const key = (req.params.key);
            blockchain.getBlock2(key).then((block) => {
                if (block) {
                    // JSON.parse makes status reports pretty pretty pretty
                    return res.status(200).send(JSON.parse(block));
                } else {
                    return res.status(404).send("Block does not exist");
                }
            }).catch((error) => {
                return res.status(500).send("Unknown error, please try again");
            })
        } else {
            return res.status(404).send("Block does not exist");
        }
    });

    app.post('/block', (req, res) => {
        let blockPOSTBodyRequest = req.body.body;
        if (blockPOSTBodyRequest !== undefined) {
            blockchain.POSTBlockHelper(blockPOSTBodyRequest).then((block) => {
                res.status(201).send(JSON.parse(block));
            });
        } else {
            return res.status(404).send("Cannot post without body value\n");
        }
    });
}

module.exports = appRouter;