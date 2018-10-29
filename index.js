// Shout out to Jakub Wlodarczyk and Ayobami Adelakum for very helpful and insightful blogs
// https://medium.com/@wlodarczyk_j/tutorial-handling-endpoints-in-node-js-and-express-ce26cb550c28
// https://medium.com/@purposenigeria/build-a-restful-api-with-node-js-and-express-js-d7e59c7a3dfb

// Import crypto-js/sha256
const SHA256 = require('crypto-js/sha256');
// import level
const level = require('level');
// import blockchain.js file
const blockchain = require('./blockchain.js');
// import express
const express = require('express');
// import routes.js
const route = require('./routes.js');
// import body parser for POST
const bodyParser = require('body-parser');
// Initalize Express
const app = express();
// Server
const http = require('http')
const server = http.Server(app);
// Http port
const port = 8000;
// import helmet
const helmet = require('helmet');

app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Accept');
    next();
});

// pre-flight requests
app.options('*', function(req, res) {
    res.send(200);
});

// calls route, initates express. Endpoints will not work without this little command.
route(app);

// Establishes on which port the server is listening
server.listen(port, (err) => {
    if (err) {
        throw err;
    }
    console.log('Node Endpoints working on port '+port);
});