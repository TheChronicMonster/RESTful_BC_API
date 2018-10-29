// Acknowledge https://www.codementor.io/wapjude/creating-a-simple-rest-api-with-expressjs-in-5min-bbtmk51mq

// Break up levelDB and require it
let levelDB = require('./level.js')
// Break up Blockchain Class and require it
let blockchain = require('./blockchain.js');

let appRouter = function(app) {
    app.get('/', function(req,res) {
        res.status(200).send("Private Blockchain home. To explore blocks, GET localhost:8000/block/{block #}");
    });

    app.get("/block/:key", (req,res) => {
        let key = req.params.key;
        console.log("The key is " + key);
        levelDB.getLevelDBData(key).then((data) => {
            res.status(200).send(JSON.parse(data));
        });
    });

    app.post('/block', (req, res) => {
        let blockPOSTBodyRequest = req.body.body;
        blockchain.POSTBlockHelper(blockPOSTBodyRequest).then((block) => {
            res.status(201).send(JSON.parse(block));
            });
    });
}

module.exports = appRouter;